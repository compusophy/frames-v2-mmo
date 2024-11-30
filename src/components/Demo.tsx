'use client';

import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { Game, Scene, GameObjects, Math as PhaserMath, Types, AUTO } from 'phaser';

class GameScene extends Scene {
  private player!: GameObjects.Sprite;
  private targetLine!: GameObjects.Line;
  private targetDot!: GameObjects.Arc;
  private backgroundObjects: GameObjects.Sprite[] = [];
  private playerTexture: string | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { pfpUrl: string }) {
    this.playerTexture = data.pfpUrl;
  }

  preload() {
    if (this.playerTexture) {
      this.load.image('player', this.playerTexture);
    }
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    this.player = this.add.sprite(centerX, centerY, 'player');
    this.player.setDisplaySize(64, 64);
    
    this.targetLine = this.add.line(0, 0, 0, 0, 0, 0, 0x666666);
    this.targetLine.setVisible(false);
    
    this.targetDot = this.add.circle(0, 0, 4, 0x666666);
    this.targetDot.setVisible(false);

    this.createBackgroundObjects();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.tweens.killTweensOf(this.targetDot);
      
      const targetX = pointer.x;
      const targetY = pointer.y;
      
      this.targetLine.setVisible(true);
      this.targetDot.setVisible(true);
      this.targetDot.setPosition(targetX, targetY);
      
      this.updateTargetLine(targetX, targetY);
      this.moveToTarget(targetX, targetY);
    });
  }

  private updateTargetLine(targetX: number, targetY: number) {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    this.targetLine.setTo(centerX, centerY, targetX, targetY);
  }

  private moveToTarget(targetX: number, targetY: number) {
    const speed = 200;
    const distance = PhaserMath.Distance.Between(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      targetX,
      targetY
    );
    
    const duration = distance / speed * 1000;

    const deltaX = (this.cameras.main.centerX - targetX);
    const deltaY = (this.cameras.main.centerY - targetY);
    
    this.backgroundObjects.forEach(obj => {
      this.tweens.killTweensOf(obj);
    });
    
    this.backgroundObjects.forEach(obj => {
      this.tweens.add({
        targets: obj,
        x: obj.x + deltaX,
        y: obj.y + deltaY,
        duration: duration,
        ease: 'Linear'
      });
    });

    this.tweens.add({
      targets: this.targetDot,
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        this.targetDot.setVisible(false);
        this.targetLine.setVisible(false);
      }
    });
  }

  private createBackgroundObjects() {
    const emojis = ['🌳', '💎', '🌿', '🍄', '🌸'];
    const numObjects = 20;
    
    for (let i = 0; i < numObjects; i++) {
      const x = PhaserMath.Between(-400, 400);
      const y = PhaserMath.Between(-400, 400);
      
      const emoji = this.add.text(
        x + this.cameras.main.centerX,
        y + this.cameras.main.centerY,
        emojis[Math.floor(Math.random() * emojis.length)],
        { fontSize: '32px' }
      );
      
      this.backgroundObjects.push(emoji as unknown as GameObjects.Sprite);
    }
  }

  update() {
    // Update line if there's an active target
    if (this.targetLine.visible && this.targetDot.visible) {
      const centerX = this.cameras.main.centerX;
      const centerY = this.cameras.main.centerY;
      
      // Update line to always connect center to current target dot position
      this.targetLine.setTo(
        centerX,
        centerY,
        this.targetDot.x,
        this.targetDot.y
      );
    }
  }
}

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (context?.user?.pfpUrl && !game) {
      const container = document.getElementById('game-container');
      if (!container) return;

      const config: Types.Core.GameConfig = {
        type: AUTO,
        parent: 'game-container',
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundColor: '#000000',
        scene: GameScene,
        physics: {
          default: 'arcade',
          arcade: {
            debug: false
          }
        }
      };

      const newGame = new Game(config);
      newGame.scene.start('GameScene', { pfpUrl: context.user.pfpUrl });
      setGame(newGame);
    }

    return () => {
      game?.destroy(true);
    };
  }, [context, game]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black">
      <div className="fixed inset-4 border-2 border-gray-700 rounded-xl flex flex-col bg-black overflow-hidden">
        <div id="game-container" className="w-full h-full" />
      </div>
    </div>
  );
}
