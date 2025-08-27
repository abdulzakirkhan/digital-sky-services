// "use client";
// import { useEffect } from "react";

// export default function OneSignalSetup() {
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     if (
//       document.querySelector(
//         'script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]'
//       )
//     ) {
//       return; // Prevent double-loading the SDK
//     }

//     const script = document.createElement("script");
//     script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
//     script.defer = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       window.OneSignalDeferred = window.OneSignalDeferred || [];
//       window.OneSignalDeferred.push(async function (OneSignal) {
      
//         await OneSignal.init({
//           // appId: "9d8e840d-8835-42f0-aaf9-3a4faf84e2e1", // Use only ONE active appId
//           // safari_web_id:"web.onesignal.auto.41b6a3ea-cfe2-480b-805a-97ab17a018f3",


//           appId: "81b2d0f8-378a-42b3-bdf1-71adaa381e72",

//           // Service Worker Configuration
//           serviceWorkerPath: "/OneSignalSDKWorker.js",
//           serviceWorkerParam: { scope: "/" },

//           // Notification Prompt
//           promptOptions: {
//             slidedown: {
//               enabled: true,
//               autoPrompt: true,
//               timeDelay: 3,
//               pageViews: 2,
//             },
//           },

//           // Required for local development
//           allowLocalhostAsSecureOrigin: true,

//           // Important for reliability
//           // initWorker: true,

//           // Recommended defaults
//           notifyButton: {
//             enable: true,
//             size: "medium",
//             position: "bottom-right",
//             showCredit: false,
//           },
//         });

//         OneSignal.on('notificationDisplay', (event) => {
//           console.log('🔔 Notification displayed:', event);
//         });
//         // Expose for global use
//         window.OneSignalInstance = OneSignal;

//         // Get subscription ID (v16+ syntax)
//         const subscriptionId = OneSignal.User.PushSubscription.id;
//         if (subscriptionId) {
//           console.log("User is subscribed. Player ID:", subscriptionId);
//         } else {
//           console.log("User is NOT subscribed yet.");
//         }
//       });
//     };

//     // Do not remove script on unmount (OneSignal SDK must persist)
//   }, []);

//   return null;
// }




"use client";
import { useEffect } from "react";

export default function OneSignalSetup() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      document.querySelector(
        'script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]'
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          await OneSignal.init({
            appId: "81b2d0f8-378a-42b3-bdf1-71adaa381e72",
            allowLocalhostAsSecureOrigin: true,
            serviceWorkerPath: "/OneSignalSDKWorker.js",
            serviceWorkerParam: { scope: "/" },
            promptOptions: {
              slidedown: {
                enabled: true,
                autoPrompt: true,
                timeDelay: 3,
                pageViews: 2,
                actionMessage: "We’d like to show you notifications.",
                acceptButtonText: "ALLOW",
                cancelButtonText: "NO THANKS",
              },
            },
            notifyButton: {
              enable: true,
              size: "medium",
              position: "bottom-right",
              showCredit: false,
            },
          });

          console.log("✅ OneSignal initialized");

          // ✅ v16+ way to listen for notification events
          OneSignal.Notifications.addEventListener("click", (event) => {
            console.log("🖱️ Notification clicked:", event);
          });

          OneSignal.Notifications.addEventListener("display", (event) => {
            console.log("🔔 Notification displayed:", event);
          });

          // ✅ Subscription check
          const isSubscribed = await OneSignal.User.PushSubscription.optedIn;
          const subscriptionId = OneSignal.User.PushSubscription.id;

          if (isSubscribed && subscriptionId) {
            console.log("✅ User is subscribed. Player ID:", subscriptionId);
          } else {
            console.log("🚫 User is NOT subscribed yet.");
          }

          // Expose SDK if needed elsewhere
          window.OneSignalInstance = OneSignal;
        } catch (error) {
          console.error("❌ OneSignal init failed:", error);
        }
      });
    };
  }, []);

  return null;
}

