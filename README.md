# MOUNT (Spring 2023)

## Billy Nowosielski, Yuyan Li, Sijie Ye, Taicheng Wu

## Table of Contents for Deployment
- [Deployment Overview](#Deployment)
- [Json Server Deployment](#Json)
- [Azure Deployment](#Azure)
- [Links](#Links)

## Deployment Overview
Deployment of our application to Azure relies on Github secrets, which is addded through settings on Github actions. We do not have access to settings on the Spark repository. The code for the application is exactly the same as the one on the Spark repository, except we wrapped it with express. If you want to run it locally, cd to the **availability_viewer** folder. **npm install** and then **node server.js**.

## Json Server Deployment
Our [json-server](https://mountserver.onrender.com/) is deployed to Render. When deploying to render, set the working directory as the **serving** folder and choose Node for runtime.

## Azure Deployment
Our [application](https://mount.azurewebsites.net/) is deployed on Azure using Github actions. The actions is located in **./github/workflows**. When deploying to Azure change the branch to the one your application is on. 

Create a web app on the Azure portal and download it's publish profile. Go to settings in your repository and then **Secrets and Variables**. Add AZURE_WEBAPP_PUBLISH_PROFILE as a secret and copy the contents of your web app publish profile to it.

Under env change AZURE_WEBAPP_NAME to the name of your azure web app. On Azure go to configurations and add your google api as a environment variable called **REACT_APP_GOOGLE_API_KEY**.


## Links
- Json Server: https://mount.azurewebsites.net
- Azure App: https://mountserver.onrender.com