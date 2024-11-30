export async function GET() {
    const BASE_URL = "frames-v2-3-1.vercel.app";
    const appUrl = `https://${BASE_URL}`;
  
    const config = {
      accountAssociation: {
    header: "eyJmaWQiOjM1MDkxMSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJGREVmM0Y0NzBlQ2QyQmM5YTk3NzU2OEM0M0FEMzg2MGMxNjExRDgifQ",
    payload: "eyJkb21haW4iOiJmcmFtZXMtdjItMy0xLnZlcmNlbC5hcHAifQ",
    signature: "MHgzN2IxOTYyNGY3NmU2OTNmZDNjM2JkNjI2MzcyZDQ2Y2MwNWRlYThiMDJhYWM0NmQzMWFlMjcyNTg4ZmE0YzA2MWJiMzU2NDhmODI3YzdmMDYzODI4M2Q1NzJlNTY2YjdjNjUwNDM2ZDdmODlhYjE4MjRlNzYzN2I5YzEyNmUxMDFi"
  },
      frame: {
        version: "0.0.0",
        name: "Frames v2 Demo",
        iconUrl: `${appUrl}/icon.png`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#ffffff",
        homeUrl: appUrl,
      },
    };
  
    return Response.json(config);
  }