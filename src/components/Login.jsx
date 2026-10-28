// import React, { useEffect, useRef, useState } from "react";
// import { backendUrl, DEVICE_AUTHORIZATION } from "./config";
// import logo from "../assets/revolve_color_logo.png";
// import revolve from "../assets/logo-22.png";
// import axios from "axios";

// const Login = () => {
//   const usernameRef = useRef(null);
//   const passwordRef = useRef(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Existing MFA state (for returning users with MFA already enabled)
//   const [requiresMfa, setRequiresMfa] = useState(false);
//   const [mfaUserId, setMfaUserId] = useState(null);
//   const [mfaCode, setMfaCode] = useState("");

//   // New MFA enrollment state (for FirstLogin = true)
//   const [requiresMfaSetup, setRequiresMfaSetup] = useState(false);
//   const [setupQrCode, setSetupQrCode] = useState("");
//   const [setupCode, setSetupCode] = useState("");
//   const [enrollmentToken, setEnrollmentToken] = useState("");

//   const [mfaChallengeToken, setMfaChallengeToken] = useState("");
//   const [isChangingMfa, setIsChangingMfa] = useState(false);
//   const [changeQrCode, setChangeQrCode] = useState("");
//   const [newPhoneCode, setNewPhoneCode] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [configValue, setConfigValue] = useState({});
//   const [loadConfig, setLoadConfig] = useState(false);

//   const dashboardUrl = "/dashboard/project-report?tab=highlevel";

//   const getConfigValue = async () => {
//     setLoadConfig(true);
//     try {
//       const configs = await axios.get(
//         `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
//       );
//       if (configs.status === 200) {
//         console.log(configs);
//         setConfigValue(configs.data);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoadConfig(false);
//     }
//   };

//   useEffect(() => {
//     getConfigValue();
//   }, []);

//   const getDeviceSignature = async () => {
//     // 1. Get local device information
//     let device;

//     try {
//       const response = await axios.get("http://127.0.0.1:18999/device");

//       device = response.data;
//     } catch {
//       throw new Error("FinAxis Device Agent is not available.");
//     }

//     if (!device?.macAddress) {
//       throw new Error("Unable to retrieve device information.");
//     }

//     // 2. Find the registered device or register it
//     let registeredDevice;

//     try {
//       const response = await axios.get(
//         `${backendUrl}/api/authorized-devices/mac_address/${encodeURIComponent(
//           device.macAddress,
//         )}`,
//       );

//       registeredDevice = response.data;
//     } catch (error) {
//       if (error.response?.status !== 404) {
//         throw error;
//       }

//       const response = await axios.post(
//         `${backendUrl}/api/authorized-devices`,
//         device,
//       );

//       registeredDevice = response.data;

//       if (!registeredDevice?.deviceId) {
//         throw new Error("Device registration failed.");
//       }
//     }

//     if (!registeredDevice?.deviceId) {
//       throw new Error("Registered device ID was not returned.");
//     }

//     // 3. Request a challenge
//     const challengeResponse = await axios.post(
//       `${backendUrl}/api/DeviceAuthorization/challenge`,
//       {
//         deviceId: registeredDevice.deviceId,
//       },
//     );

//     const challenge = challengeResponse.data;

//     if (
//       !challenge?.challengeId ||
//       !challenge?.deviceId ||
//       !challenge?.challenge
//     ) {
//       throw new Error("Unable to obtain a device authentication challenge.");
//     }

//     // 4. Sign the challenge using the local Device Agent
//     let signature;

//     try {
//       const signResponse = await axios.post("http://127.0.0.1:18999/sign", {
//         deviceId: challenge.deviceId,
//         challenge: challenge.challenge,
//         timestamp: new Date().toISOString(),
//       });

//       signature = signResponse.data;
//     } catch {
//       throw new Error("Unable to sign the device challenge.");
//     }

//     if (!signature) {
//       throw new Error("The Device Agent did not return a signature.");
//     }

//     // Handle either a raw signature string or an object response.
//     const signatureValue =
//       typeof signature === "string" ? signature : signature.signatureBase64;

//     if (!signatureValue) {
//       throw new Error("The device signature is missing.");
//     }

//     // 5. Verify the signed challenge with the backend
//     try {
//       const verifyResponse = await axios.post(
//         `${backendUrl}/api/DeviceAuthorization/verify`,
//         {
//           challengeId: challenge.challengeId,
//           deviceId: challenge.deviceId,
//           signature: signatureValue,
//           macAddress: device.macAddress,
//         },
//       );

//       // Axios throws automatically for non-2xx responses.
//       // Return only after successful verification.
//       return verifyResponse.data;
//     } catch (error) {
//       if (error.response) {
//         throw new Error(
//           error.response.data?.message ||
//             error.response.data?.Message ||
//             "This device is not authorized.",
//         );
//       }

//       throw new Error("Unable to verify device authorization.");
//     }
//   };

//   const handleLogin = async () => {
//     setError("");

//     const username = usernameRef.current?.value.trim();
//     const password = passwordRef.current?.value;

//     if (!username || !password) {
//       setError("Please enter both username and password.");
//       return;
//     }

//     setLoading(true);

//     const deviceAuthorizationConfig = configValue?.filter(
//       (c) => c.name === "enable_device_auth",
//     );

//     try {
//       // 1. Verify the device before allowing login
//       if (deviceAuthorizationConfig[0].value === "true") {
//         await getDeviceSignature();
//       }

//       // 2. Login only after device verification succeeds
//       const response = await axios.post(
//         `${backendUrl}/api/User/loginV1`,
//         {
//           username,
//           password,
//         },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const data = response.data;

//       // 3. First-time MFA setup
//       if (data.requiresMfaSetup === true && data.enrollmentToken) {
//         setMfaUserId(data.userId);
//         setEnrollmentToken(data.enrollmentToken);
//         setRequiresMfaSetup(true);
//         setRequiresMfa(false);
//         setSetupQrCode("");

//         await loadMfaSetup(data.enrollmentToken);
//         return;
//       }

//       // 4. Existing user with MFA enabled
//       if (data.requiresMfa === true) {
//         setMfaUserId(data.userId);
//         setMfaChallengeToken(data.mfaChallengeToken);
//         setRequiresMfa(true);
//         setRequiresMfaSetup(false);
//         return;
//       }

//       // 5. Normal login
//       saveLoginAndRedirect(data);
//     } catch (err) {
//       if (err.response?.status === 429) {
//         setError("Too many login attempts. Please try again in 2 minutes.");
//         return;
//       }

//       setError(
//         err.response?.data?.message ||
//           err.response?.data?.error ||
//           err.response?.data?.Message ||
//           err.message ||
//           "Login failed. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMfaSetup = async (token) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/mfa/setup`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 429) {
//         setError("Too many login attempts. Please try again in 2 minutes.");
//         return;
//       }

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         const errorMessage = data.message || data.Message || "";
//         if (errorMessage.toLowerCase().includes("mfa is already enabled")) {
//           setRequiresMfaSetup(false);
//           setRequiresMfa(true);
//           setError("");
//           return;
//         }
//         throw new Error(
//           errorMessage || `MFA setup failed (${response.status})`,
//         );
//       }

//       if (!data.qrCodeDataUri) {
//         throw new Error("The API did not return a QR code.");
//       }

//       setSetupQrCode(data.qrCodeDataUri);
//     } catch (err) {
//       setError(err.message || "Failed to load MFA setup QR code.");
//     }
//   };

//   // Verify setup code for FirstLogin user
//   const handleVerifySetup = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!/^\d{6}$/.test(setupCode)) {
//       setError("Please enter a valid six-digit authenticator code.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/mfa/verify-setup`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${enrollmentToken}`,
//         },
//         body: JSON.stringify({
//           code: setupCode,
//         }),
//       });

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         setError(
//           data.message ||
//             data.error ||
//             data.Message ||
//             "Invalid or expired code. Please try again.",
//         );
//         setSetupCode("");
//         return;
//       }

//       // After successful setup verification, log them in fully or trigger standard login post-setup
//       // Note: If VerifySetup returns a token, handle it. Otherwise prompt login or call login endpoint.
//       if (data.token) {
//         saveLoginAndRedirect(data);
//       } else {
//         // Fallback: prompt user to log in again with credentials now that FirstLogin is false
//         setRequiresMfaSetup(false);
//         setRequiresMfa(false);
//         setError("MFA setup successful! Please log in with your credentials.");
//         setSetupCode("");
//       }
//     } catch (err) {
//       setError("Network error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify MFA code for returning users
//   const handleVerifyMfaLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!/^\d{6}$/.test(mfaCode)) {
//       setError("Please enter a valid six-digit authenticator code.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/User/verify-mfa-login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${mfaChallengeToken}`,
//         },
//         body: JSON.stringify({
//           userId: mfaUserId,
//           code: mfaCode,
//         }),
//       });

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         setError(
//           data.message ||
//             data.error ||
//             data.Message ||
//             "Invalid or expired code. Please try again.",
//         );
//         setMfaCode("");
//         return;
//       }

//       if (!data.token) {
//         setError("Verification succeeded, but no login token was returned.");
//         return;
//       }

//       saveLoginAndRedirect(data);
//     } catch (err) {
//       setError("Network error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify the current authenticator and request a new QR code.
//   const handleStartMfaChange = async () => {
//     setError("");
//     setSuccessMessage("");

//     if (!mfaChallengeToken) {
//       setError("Your MFA session expired. Please log in again.");
//       return;
//     }

//     if (!/^\d{6}$/.test(mfaCode)) {
//       setError("Enter your current six-digit authenticator code first.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/mfa/change-setup`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${mfaChallengeToken}`,
//         },
//         body: JSON.stringify({ currentCode: mfaCode }),
//       });

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         setError(data.message || "Unable to start new phone setup.");
//         return;
//       }

//       if (!data.qrCodeDataUri) {
//         setError("The API did not return a QR code.");
//         return;
//       }

//       setChangeQrCode(data.qrCodeDataUri);
//       setNewPhoneCode("");
//       setIsChangingMfa(true);
//     } catch {
//       setError("Network error while starting new phone setup.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify the new phone and replace the old active MFA secret.
//   const handleVerifyNewPhone = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMessage("");

//     if (!/^\d{6}$/.test(newPhoneCode)) {
//       setError("Enter the six-digit code from your new phone.");
//       return;
//     }

//     if (!mfaChallengeToken) {
//       setError("Your MFA session expired. Please log in again.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/mfa/verify-change`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${mfaChallengeToken}`,
//         },
//         body: JSON.stringify({ newCode: newPhoneCode }),
//       });

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         setError(data.message || "Could not verify the new authenticator.");
//         setNewPhoneCode("");
//         return;
//       }

//       setIsChangingMfa(false);
//       setChangeQrCode("");
//       setNewPhoneCode("");
//       setMfaCode("");
//       setMfaChallengeToken("");
//       setMfaUserId(null);
//       setRequiresMfa(false);
//       setRequiresMfaSetup(false);
//       setSuccessMessage(
//         "Your new authenticator is active. Please log in again.",
//       );
//     } catch {
//       setError("Network error while verifying the new authenticator.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveLoginAndRedirect = (data) => {
//     localStorage.setItem("authToken", data.token);

//     const userObj = {
//       name: data.username,
//       role: data.role,
//       userId: data.user_Id ?? data.userId,
//       token: data.token,
//       fullName: data.fullName,
//     };

//     localStorage.setItem("currentUser", JSON.stringify(userObj));
//     window.location.href = dashboardUrl;
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !loading) {
//       if (requiresMfa) {
//         e.preventDefault();
//         document.getElementById("mfa-verify-button")?.click();
//       } else if (requiresMfaSetup) {
//         e.preventDefault();
//         document.getElementById("setup-verify-button")?.click();
//       } else if (isChangingMfa) {
//         e.preventDefault();
//         document.getElementById("new-phone-verify-button")?.click();
//       } else {
//         handleLogin();
//       }
//     }
//   };

//   const handleBackToLogin = () => {
//     setRequiresMfa(false);
//     setRequiresMfaSetup(false);
//     setMfaUserId(null);
//     setMfaChallengeToken("");
//     setIsChangingMfa(false);
//     setChangeQrCode("");
//     setNewPhoneCode("");
//     setSuccessMessage("");
//     setMfaCode("");
//     setSetupCode("");
//     setSetupQrCode("");
//     setEnrollmentToken("");
//     setError("");
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-[#07171F]">
//       {/* LEFT SIDE */}
//       <div className="w-full lg:w-1/2 relative flex items-center justify-center bg-gray-100 overflow-hidden min-h-[35vh] lg:min-h-screen">
//         <div className="relative z-10 flex flex-col items-center text-center px-10">
//           <img
//             src={logo}
//             alt="Lumina Corps"
//             className="w-[80%] max-w-[600px] object-contain"
//           />
//           <p className="mt-8 text-black text-sm tracking-[0.35em]">
//             Planning Management System
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex items-center justify-center px-6 py-8 bg-[#07171F]">
//         <div className="w-full max-w-xl">
//           <div className="bg-[#0F2530] border border-white/10 rounded-3xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
//             {/* Company Logo */}
//             <div className="flex justify-center mb-8">
//               <img
//                 src={revolve}
//                 alt="Revolve"
//                 className="h-20 object-contain opacity-90"
//               />
//             </div>

//             {/* Heading */}
//             <div className="mb-6 text-center">
//               <h2 className="text-2xl font-semibold text-white">
//                 {requiresMfaSetup
//                   ? "Set Up Two-Factor Authentication"
//                   : requiresMfa
//                     ? "Two-Factor Authentication"
//                     : "Welcome Back"}
//               </h2>

//               <p className="text-gray-400 text-sm mt-2">
//                 {requiresMfaSetup
//                   ? "Register your authenticator app to secure your account."
//                   : requiresMfa
//                     ? "Enter the six-digit code from your authenticator app."
//                     : "Sign in to continue"}
//               </p>
//             </div>

//             {/* Error */}
//             {error && (
//               <div
//                 role="alert"
//                 className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center"
//               >
//                 {error}
//               </div>
//             )}

//             {requiresMfaSetup ? (
//               <form onSubmit={handleVerifySetup}>
//                 <div className="mb-6 text-center">
//                   <p className="text-sm text-gray-300 mb-4">
//                     Scan this QR code using Google Authenticator or Microsoft
//                     Authenticator.
//                   </p>

//                   {setupQrCode ? (
//                     <div className="inline-block rounded-xl bg-white p-4">
//                       <img
//                         src={setupQrCode}
//                         alt="Authenticator setup QR code"
//                         className="w-52 h-52 object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-400">Loading QR code...</p>
//                   )}
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="setup-code"
//                     className="block text-sm text-gray-300 mb-2"
//                   >
//                     Authenticator Code
//                   </label>

//                   <input
//                     id="setup-code"
//                     type="text"
//                     inputMode="numeric"
//                     autoComplete="one-time-code"
//                     pattern="[0-9]{6}"
//                     maxLength={6}
//                     value={setupCode}
//                     onChange={(e) =>
//                       setSetupCode(
//                         e.target.value.replace(/\D/g, "").slice(0, 6),
//                       )
//                     }
//                     onKeyDown={handleKeyDown}
//                     placeholder="Enter 6-digit code"
//                     disabled={loading}
//                     autoFocus
//                     className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-center tracking-[0.5em] text-xl text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                   />
//                 </div>

//                 <button
//                   id="setup-verify-button"
//                   type="submit"
//                   disabled={loading || setupCode.length !== 6}
//                   className="w-full h-12 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-[#07171F] disabled:bg-gray-600 disabled:text-gray-300"
//                 >
//                   {loading ? "Verifying..." : "Verify & Enable MFA"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleBackToLogin}
//                   disabled={loading}
//                   className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300"
//                 >
//                   Back to Login
//                 </button>
//               </form>
//             ) : requiresMfa && isChangingMfa ? (
//               <form onSubmit={handleVerifyNewPhone}>
//                 <div className="mb-5 text-center">
//                   <p className="text-sm text-gray-300 mb-4">
//                     Scan this QR code using the authenticator app on your new
//                     phone.
//                   </p>

//                   {changeQrCode ? (
//                     <div className="inline-block rounded-xl bg-white p-4">
//                       <img
//                         src={changeQrCode}
//                         alt="New phone authenticator QR code"
//                         className="w-52 h-52 object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-400">Loading QR code...</p>
//                   )}
//                 </div>

//                 <div className="mb-6">
//                   <label
//                     htmlFor="new-phone-code"
//                     className="block text-sm text-gray-300 mb-2"
//                   >
//                     Code from new phone
//                   </label>

//                   <input
//                     id="new-phone-code"
//                     type="text"
//                     inputMode="numeric"
//                     autoComplete="one-time-code"
//                     maxLength={6}
//                     value={newPhoneCode}
//                     onChange={(e) =>
//                       setNewPhoneCode(
//                         e.target.value.replace(/\D/g, "").slice(0, 6),
//                       )
//                     }
//                     placeholder="Enter 6-digit code"
//                     disabled={loading}
//                     autoFocus
//                     className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-center tracking-[0.5em] text-xl text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                   />
//                 </div>

//                 <button
//                   id="new-phone-verify-button"
//                   type="submit"
//                   disabled={loading || newPhoneCode.length !== 6}
//                   className="w-full h-12 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-[#07171F] disabled:bg-gray-600 disabled:text-gray-300"
//                 >
//                   {loading ? "Verifying..." : "Verify & Replace Phone"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsChangingMfa(false);
//                     setChangeQrCode("");
//                     setNewPhoneCode("");
//                     setError("");
//                   }}
//                   disabled={loading}
//                   className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300"
//                 >
//                   Cancel
//                 </button>
//               </form>
//             ) : !requiresMfa ? (
//               <>
//                 {/* Username */}
//                 <div className="mb-5">
//                   <label className="block text-sm text-gray-300 mb-2">
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter your username"
//                     ref={usernameRef}
//                     onKeyDown={handleKeyDown}
//                     disabled={loading || loadConfig}
//                     autoComplete="username"
//                     className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="mb-6">
//                   <label className="block text-sm text-gray-300 mb-2">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="Enter your password"
//                     ref={passwordRef}
//                     onKeyDown={handleKeyDown}
//                     disabled={loading || loadConfig}
//                     autoComplete="current-password"
//                     className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                   />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={handleLogin}
//                   disabled={loading || loadConfig}
//                   className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
//                     loading
//                       ? "bg-gray-600 text-gray-300 cursor-not-allowed"
//                       : "bg-cyan-400 hover:bg-cyan-300 text-[#07171F]"
//                   }`}
//                 >
//                   {loading ? "Authenticating..." : "Login"}
//                 </button>
//               </>
//             ) : (
//               <form onSubmit={handleVerifyMfaLogin}>
//                 {/* Authenticator Code */}
//                 <div className="mb-6">
//                   <label
//                     htmlFor="mfa-code"
//                     className="block text-sm text-gray-300 mb-2"
//                   >
//                     Authenticator Code
//                   </label>
//                   <input
//                     id="mfa-code"
//                     type="text"
//                     inputMode="numeric"
//                     autoComplete="one-time-code"
//                     pattern="[0-9]{6}"
//                     maxLength={6}
//                     placeholder="Enter 6-digit code"
//                     value={mfaCode}
//                     onChange={(e) =>
//                       setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
//                     }
//                     onKeyDown={handleKeyDown}
//                     disabled={loading}
//                     autoFocus
//                     className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-center tracking-[0.5em] text-xl text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                   />
//                 </div>

//                 <button
//                   id="mfa-verify-button"
//                   type="submit"
//                   disabled={loading || mfaCode.length !== 6}
//                   className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
//                     loading || mfaCode.length !== 6
//                       ? "bg-gray-600 text-gray-300 cursor-not-allowed"
//                       : "bg-cyan-400 hover:bg-cyan-300 text-[#07171F]"
//                   }`}
//                 >
//                   {loading ? "Verifying..." : "Verify Code"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleStartMfaChange}
//                   disabled={loading}
//                   className="w-full mt-3 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
//                 >
//                   Set up a new phone
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleBackToLogin}
//                   disabled={loading}
//                   className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
//                 >
//                   Back to Login
//                 </button>
//               </form>
//             )}

//             {/* Footer */}
//             <div className="mt-6 text-center text-xs text-white">
//               © 2026{" "}
//               <a
//                 href="https://www.revolvefintech.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
//               >
//                 Revolve
//               </a>
//               . All rights reserved.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { backendUrl } from "./config";
// import logo from "../assets/revolve_color_logo.png";
// import revolve from "../assets/logo-22.png";

// const Login = () => {
//   const navigate = useNavigate();
//   const usernameRef = useRef(null);
//   const passwordRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // const handleLogin = async () => {
//   //   setError("");
//   //   const username = usernameRef.current?.value.trim();
//   //   const password = passwordRef.current?.value;

//   //   if (!username || !password) {
//   //     setError("Please enter both username and password.");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     const response = await fetch(`${backendUrl}/api/User/loginV1`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ username, password }),
//   //     });

//   //     if (response.ok) {
//   //       const data = await response.json();

//   //       // 1. Commit token and user object synchronously to localStorage
//   //       if (data.token) {
//   //         localStorage.setItem("authToken", data.token);
//   //       }

//   //       if (data.role) {
//   //         const userObj = {
//   //           name: data.username,
//   //           role: data.role,
//   //           userId: data.user_Id,
//   //           token: data.token,
//   //           fullName: data.fullName,
//   //         };
//   //         localStorage.setItem("currentUser", JSON.stringify(userObj));
//   //       }

//   //       // 2. Crucial Timing Fix: Let the browser process the state updates before navigating
//   //       // setTimeout(() => {
//   //       //   navigate("/dashboard/project-budget-status", { replace: true });
//   //       // }, 50);
//   //       window.location.href = "/dashboard/project-report?tab=highlevel";
//   //     } else {
//   //       const contentType = response.headers.get("content-type");
//   //       let errorMessage = "Login failed. Please check your credentials.";

//   //       if (contentType && contentType.includes("application/json")) {
//   //         try {
//   //           const errData = await response.json();
//   //           errorMessage =
//   //             errData.message ||
//   //             errData.error ||
//   //             errData.Message ||
//   //             errData.Error ||
//   //             errorMessage;
//   //         } catch {
//   //           // Fallback handled by default assignment
//   //         }
//   //       } else {
//   //         try {
//   //           const textResponse = await response.text();
//   //           errorMessage = textResponse.trim() || errorMessage;
//   //         } catch {
//   //           // Fallback handled by default assignment
//   //         }
//   //       }

//   //       setError(errorMessage);
//   //     }
//   //   } catch (error) {
//   //     setError("Network error. Please try again later.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleLogin = async () => {
//     setError("");

//     const username = usernameRef.current?.value.trim();
//     const password = passwordRef.current?.value;

//     if (!username || !password) {
//       setError("Please enter both username and password.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/User/loginV1`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.status === 429) {
//         setError("Too many login attempts. Please try again in 2 minutes.");
//         return;
//       }

//       if (response.ok) {
//         const data = await response.json();

//         if (data.role) {
//           const userObj = {
//             name: data.username,
//             role: data.role,
//             userId: data.userId,
//             fullName: data.fullName,
//           };

//           localStorage.setItem("currentUser", JSON.stringify(userObj));
//         }

//         window.location.href = "/dashboard/project-report?tab=highlevel";
//       } else {
//         const contentType = response.headers.get("content-type");
//         let errorMessage = "Login failed. Please check your credentials.";

//         if (contentType?.includes("application/json")) {
//           try {
//             const errData = await response.json();
//             errorMessage =
//               errData.message ||
//               errData.error ||
//               errData.Message ||
//               errData.Error ||
//               errorMessage;
//           } catch {
//             // Use the default error message.
//           }
//         } else {
//           try {
//             const textResponse = await response.text();
//             errorMessage = textResponse.trim() || errorMessage;
//           } catch {
//             // Use the default error message.
//           }
//         }

//         setError(errorMessage);
//       }
//     } catch (error) {
//       setError("Network error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleLogin();
//     }
//   };

//   // return (
//   //   <div className="flex items-center justify-center min-h-screen bg-blue-100">
//   //     <div className="bg-white p-6 rounded shadow-md w-80">
//   //       <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
//   //         Login
//   //       </h2>
//   //       {error && (
//   //         <div className="mb-3 text-red-600 text-center text-sm bg-red-50 p-2 rounded">
//   //           {error}
//   //         </div>
//   //       )}
//   //       <input
//   //         type="text"
//   //         placeholder="Username"
//   //         className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //         ref={usernameRef}
//   //         onKeyDown={handleKeyDown}
//   //         disabled={loading}
//   //       />
//   //       <input
//   //         type="password"
//   //         placeholder="Password"
//   //         className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //         ref={passwordRef}
//   //         onKeyDown={handleKeyDown}
//   //         disabled={loading}
//   //       />
//   //       <button
//   //         onClick={handleLogin}
//   //         className={`w-full py-2 rounded font-medium text-white transition-colors ${
//   //           loading
//   //             ? "bg-gray-400 cursor-not-allowed"
//   //             : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
//   //         }`}
//   //         disabled={loading}
//   //       >
//   //         {loading ? "Logging in..." : "Login"}
//   //       </button>
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-[#07171F]">
//       {/* LEFT SIDE */}
//       <div className="w-full lg:w-1/2 relative flex items-center justify-center bg-gray-100 overflow-hidden min-h-[35vh] lg:min-h-screen">
//         {/* Background Accent */}
//         {/* <div className="absolute inset-0">
//           <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/10 blur-3xl rounded-full" />
//           <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-400/10 blur-3xl rounded-full" />
//         </div> */}

//         {/* Client Branding */}
//         <div className="relative z-10 flex flex-col items-center text-center px-10">
//           <img
//             src={logo}
//             alt="Lumina Corps"
//             className="w-[80%] max-w-[600px] object-contain"
//           />

//           <p className="mt-8 text-black text-sm tracking-[0.35em] ">
//             Planning Management System
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex items-center justify-center px-6 bg-[#07171F]">
//         <div className="w-full max-w-xl">
//           {/* Login Card */}
//           <div className="bg-[#0F2530] border border-white/10 rounded-3xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
//             {/* Your Company Logo */}
//             <div className="flex justify-center mb-8">
//               <img
//                 src={revolve}
//                 alt="Revolve"
//                 className="h-20 object-contain opacity-90"
//               />
//             </div>

//             {/* Heading */}
//             {/* <div className="mb-8 text-center">
//           <h2 className="text-3xl font-semibold text-white">
//             Welcome Back
//           </h2>

//           <p className="text-gray-400 text-sm mt-2">
//             Sign in to continue
//           </p>
//         </div> */}

//             {/* Error */}
//             {error && (
//               <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center">
//                 {error}
//               </div>
//             )}

//             {/* Username */}
//             <div className="mb-5">
//               <label className="block text-sm text-gray-300 mb-2">
//                 Username
//               </label>

//               <input
//                 type="text"
//                 placeholder="Enter your username"
//                 ref={usernameRef}
//                 onKeyDown={handleKeyDown}
//                 disabled={loading}
//                 className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label className="block text-sm text-gray-300 mb-2">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 ref={passwordRef}
//                 onKeyDown={handleKeyDown}
//                 disabled={loading}
//                 className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               />
//             </div>

//             {/* Login Button */}
//             <button
//               onClick={handleLogin}
//               disabled={loading}
//               className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
//                 loading
//                   ? "bg-gray-600 text-gray-300 cursor-not-allowed"
//                   : "bg-cyan-400 hover:bg-cyan-300 text-[#07171F]"
//               }`}
//             >
//               {loading ? "Authenticating..." : "Login"}
//             </button>

//             {/* Footer */}
//             <div className="mt-6 text-center text-xs text-white">
//               © 2026{" "}
//               <a
//                 href="https://www.revolvefintech.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
//               >
//                 Revolve
//               </a>
//               . All rights reserved.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useRef, useState } from "react";
import { backendUrl } from "./config";
import logo from "../assets/CapComm_Logo_v2_nobk.png";
import fedaxis from "../assets/fed_axis_login_image.png";
import axios from "axios";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Existing MFA state (for returning users with MFA already enabled)
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);
  const [mfaCode, setMfaCode] = useState("");

  // New MFA enrollment state (for FirstLogin = true)
  const [requiresMfaSetup, setRequiresMfaSetup] = useState(false);
  const [setupQrCode, setSetupQrCode] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [enrollmentToken, setEnrollmentToken] = useState("");

  const [mfaChallengeToken, setMfaChallengeToken] = useState("");
  const [isChangingMfa, setIsChangingMfa] = useState(false);
  const [changeQrCode, setChangeQrCode] = useState("");
  const [newPhoneCode, setNewPhoneCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [mfaMethod, setMfaMethod] = useState("authenticator");
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [configValue, setConfigValue] = useState({});
  const [loadConfig, setLoadConfig] = useState(false);

  // const dashboardUrl = "/dashboard/project-report?tab=highlevel";
  const dashboardUrl = "/dashboard/sub-create-timesheet";

  const getConfigValue = async () => {
    setLoadConfig(true);
    try {
      const configs = await axios.get(
        `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
      );
      if (configs.status === 200) {
        console.log(configs);
        setConfigValue(configs.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadConfig(false);
    }
  };

  useEffect(() => {
    getConfigValue();
  }, []);

  const getDeviceSignature = async () => {
    // 1. Get local device information
    let device;

    try {
      const response = await axios.get("http://127.0.0.1:18999/device");

      device = response.data;
    } catch {
      throw new Error("FinAxis Device Agent is not available.");
    }

    if (!device?.macAddress) {
      throw new Error("Unable to retrieve device information.");
    }

    // 2. Find the registered device or register it
    let registeredDevice;

    try {
      const response = await axios.get(
        `${backendUrl}/api/authorized-devices/mac_address/${encodeURIComponent(
          device.macAddress,
        )}`,
      );

      registeredDevice = response.data;
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }

      const response = await axios.post(
        `${backendUrl}/api/authorized-devices`,
        device,
      );

      registeredDevice = response.data;

      if (!registeredDevice?.deviceId) {
        throw new Error("Device registration failed.");
      }
    }

    if (!registeredDevice?.deviceId) {
      throw new Error("Registered device ID was not returned.");
    }

    // 3. Request a challenge
    const challengeResponse = await axios.post(
      `${backendUrl}/api/DeviceAuthorization/challenge`,
      {
        deviceId: registeredDevice.deviceId,
      },
    );

    const challenge = challengeResponse.data;

    if (
      !challenge?.challengeId ||
      !challenge?.deviceId ||
      !challenge?.challenge
    ) {
      throw new Error("Unable to obtain a device authentication challenge.");
    }

    // 4. Sign the challenge using the local Device Agent
    let signature;

    try {
      const signResponse = await axios.post("http://127.0.0.1:18999/sign", {
        deviceId: challenge.deviceId,
        challenge: challenge.challenge,
        timestamp: new Date().toISOString(),
      });

      signature = signResponse.data;
    } catch {
      throw new Error("Unable to sign the device challenge.");
    }

    if (!signature) {
      throw new Error("The Device Agent did not return a signature.");
    }

    // Handle either a raw signature string or an object response.
    const signatureValue =
      typeof signature === "string" ? signature : signature.signatureBase64;

    if (!signatureValue) {
      throw new Error("The device signature is missing.");
    }

    // 5. Verify the signed challenge with the backend
    try {
      const verifyResponse = await axios.post(
        `${backendUrl}/api/DeviceAuthorization/verify`,
        {
          challengeId: challenge.challengeId,
          deviceId: challenge.deviceId,
          signature: signatureValue,
          macAddress: device.macAddress,
        },
      );

      // Axios throws automatically for non-2xx responses.
      // Return only after successful verification.
      return verifyResponse.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            error.response.data?.Message ||
            "This device is not authorized.",
        );
      }

      throw new Error("Unable to verify device authorization.");
    }
  };

  const handleLogin = async () => {
    setError("");

    const username = usernameRef.current?.value.trim();
    const password = passwordRef.current?.value;

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    const deviceAuthorizationConfig = configValue?.filter(
      (c) => c.name === "enable_device_auth",
    );

    try {
      if (deviceAuthorizationConfig[0].value === "true") {
        await getDeviceSignature();
      }

      const response = await fetch(`${backendUrl}/api/User/loginV1`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 429) {
        setError("Too many login attempts. Please try again in 2 minutes.");
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            data.Message ||
            "Login failed. Please check your credentials.",
        );
        return;
      }

      // First login: show QR setup
      if (data.requiresMfaSetup === true && data.enrollmentToken) {
        setMfaUserId(data.userId);
        setEnrollmentToken(data.enrollmentToken);
        setRequiresMfaSetup(true);
        setRequiresMfa(false);
        setSetupQrCode("");

        await loadMfaSetup(data.enrollmentToken);
        return;
      }

      // Returning user with MFA enabled
      // Returning user with MFA enabled
      if (data.requiresMfa === true) {
        setMfaUserId(data.userId);
        setMfaChallengeToken(data.mfaChallengeToken); // <-- Save the challenge token here
        setRequiresMfa(true);
        setRequiresMfaSetup(false);
        return;
      }
      // Normal login for an existing user without MFA.
      if (!data.token) {
        setError("Login failed: authentication token was not returned.");
        return;
      }

      saveLoginAndRedirect(data);
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");

    if (!mfaChallengeToken) {
      setError("Your MFA session expired. Please log in again.");
      return;
    }

    if (!["email", "sms"].includes(mfaMethod)) {
      setError("Please select Email or SMS verification.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/mfa/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({ method: mfaMethod }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || data.Message || "Unable to send OTP.");
        return;
      }

      if (!data.challengeId) {
        setError("The server did not return an OTP challenge.");
        return;
      }

      setOtpChallengeId(data.challengeId);
      setOtpSent(true);
      setMfaCode("");
      setError("");
    } catch {
      setError("Network error while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpChallengeId) {
      setError("Please request an OTP first.");
      return;
    }

    if (!/^\d{6}$/.test(mfaCode)) {
      setError("Please enter a valid six-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/mfa/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({
          challengeId: otpChallengeId,
          method: mfaMethod,
          code: mfaCode,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.message ||
            data.Message ||
            "Invalid or expired OTP. Please try again.",
        );
        setMfaCode("");
        return;
      }

      if (!data.token) {
        setError("Verification succeeded, but no login token was returned.");
        return;
      }

      saveLoginAndRedirect(data);
    } catch {
      setError("Network error while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const loadMfaSetup = async (token) => {
    try {
      const response = await fetch(`${backendUrl}/api/mfa/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 429) {
        setError("Too many login attempts. Please try again in 2 minutes.");
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data.message || data.Message || "";
        if (errorMessage.toLowerCase().includes("mfa is already enabled")) {
          setRequiresMfaSetup(false);
          setRequiresMfa(true);
          setError("");
          return;
        }
        throw new Error(
          errorMessage || `MFA setup failed (${response.status})`,
        );
      }

      if (!data.qrCodeDataUri) {
        throw new Error("The API did not return a QR code.");
      }

      setSetupQrCode(data.qrCodeDataUri);
    } catch (err) {
      setError(err.message || "Failed to load MFA setup QR code.");
    }
  };

  // Verify setup code for FirstLogin user
  const handleVerifySetup = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(setupCode)) {
      setError("Please enter a valid six-digit authenticator code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/mfa/verify-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${enrollmentToken}`,
        },
        body: JSON.stringify({
          code: setupCode,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            data.Message ||
            "Invalid or expired code. Please try again.",
        );
        setSetupCode("");
        return;
      }

      // After successful setup verification, log them in fully or trigger standard login post-setup
      // Note: If VerifySetup returns a token, handle it. Otherwise prompt login or call login endpoint.
      if (data.token) {
        saveLoginAndRedirect(data);
      } else {
        // Fallback: prompt user to log in again with credentials now that FirstLogin is false
        setRequiresMfaSetup(false);
        setRequiresMfa(false);
        setError("MFA setup successful! Please log in with your credentials.");
        setSetupCode("");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Verify MFA code for returning users
  const handleVerifyMfaLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(mfaCode)) {
      setError("Please enter a valid six-digit authenticator code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/User/verify-mfa-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({
          userId: mfaUserId,
          code: mfaCode,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            data.Message ||
            "Invalid or expired code. Please try again.",
        );
        setMfaCode("");
        return;
      }

      if (!data.token) {
        setError("Verification succeeded, but no login token was returned.");
        return;
      }

      saveLoginAndRedirect(data);
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Verify the current authenticator and request a new QR code.
  const handleStartMfaChange = async () => {
    setError("");
    setSuccessMessage("");

    if (!mfaChallengeToken) {
      setError("Your MFA session expired. Please log in again.");
      return;
    }

    if (!/^\d{6}$/.test(mfaCode)) {
      setError("Enter your current six-digit authenticator code first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/mfa/change-setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({ currentCode: mfaCode }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Unable to start new phone setup.");
        return;
      }

      if (!data.qrCodeDataUri) {
        setError("The API did not return a QR code.");
        return;
      }

      setChangeQrCode(data.qrCodeDataUri);
      setNewPhoneCode("");
      setIsChangingMfa(true);
    } catch {
      setError("Network error while starting new phone setup.");
    } finally {
      setLoading(false);
    }
  };

  // Verify the new phone and replace the old active MFA secret.
  const handleVerifyNewPhone = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!/^\d{6}$/.test(newPhoneCode)) {
      setError("Enter the six-digit code from your new phone.");
      return;
    }

    if (!mfaChallengeToken) {
      setError("Your MFA session expired. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/mfa/verify-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mfaChallengeToken}`,
        },
        body: JSON.stringify({ newCode: newPhoneCode }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Could not verify the new authenticator.");
        setNewPhoneCode("");
        return;
      }

      setIsChangingMfa(false);
      setChangeQrCode("");
      setNewPhoneCode("");
      setMfaCode("");
      setMfaChallengeToken("");
      setMfaUserId(null);
      setRequiresMfa(false);
      setRequiresMfaSetup(false);
      setSuccessMessage(
        "Your new authenticator is active. Please log in again.",
      );
    } catch {
      setError("Network error while verifying the new authenticator.");
    } finally {
      setLoading(false);
    }
  };

  const saveLoginAndRedirect = (data) => {
    localStorage.setItem("authToken", data.token);

    const userObj = {
      name: data.username,
      role: data.role,
      userId: data.user_Id ?? data.userId,
      token: data.token,
      fullName: data.fullName,
      ts_Sch_Id: data.ts_Sch_Id,
      employeeId: data.empl_Id
    };
    

    localStorage.setItem("currentUser", JSON.stringify(userObj));
    window.location.href = dashboardUrl;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      if (requiresMfa) {
        e.preventDefault();
        document.getElementById("mfa-verify-button")?.click();
      } else if (requiresMfaSetup) {
        e.preventDefault();
        document.getElementById("setup-verify-button")?.click();
      } else if (isChangingMfa) {
        e.preventDefault();
        document.getElementById("new-phone-verify-button")?.click();
      } else {
        handleLogin();
      }
    }
  };

  const handleBackToLogin = () => {
    setRequiresMfa(false);
    setRequiresMfaSetup(false);
    setMfaUserId(null);
    setMfaChallengeToken("");
    setIsChangingMfa(false);
    setChangeQrCode("");
    setNewPhoneCode("");
    setSuccessMessage("");
    setMfaCode("");
    setSetupCode("");
    setSetupQrCode("");
    setEnrollmentToken("");
    setMfaMethod("authenticator");
    setOtpChallengeId("");
    setOtpSent(false);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#07171F]">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center bg-gray-100 overflow-hidden min-h-[35vh] lg:min-h-screen">
        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <img
            src={logo}
            alt="Lumina Corps"
            className="w-[70%] max-w-[500px] object-contain"
          />
          <p className="mt-4 text-black text-sm tracking-[0.35em]">
            Timesheet Management System
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex items-center justify-center px-6 py-8 bg-[#07171F]">
        <div className="w-full max-w-xl">
          <div className="bg-[#0F2530] border border-white/10 rounded-3xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            {/* Company Logo */}
            <div className="flex justify-center mb-8">
              <img
                src={fedaxis}
                alt="FedAxis"
                className="h-20 object-contain opacity-90"
              />
            </div>

            {/* Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                {requiresMfaSetup
                  ? "Set Up Two-Factor Authentication"
                  : requiresMfa
                    ? "Two-Factor Authentication"
                    : ""}
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                {requiresMfaSetup
                  ? "Register your authenticator app to secure your account."
                  : requiresMfa
                    ? "Enter the six-digit code from your authenticator app."
                    : ""}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 text-center"
              >
                {error}
              </div>
            )}

            {requiresMfaSetup ? (
              <form onSubmit={handleVerifySetup}>
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-300 mb-4">
                    Scan this QR code using Google Authenticator or Microsoft
                    Authenticator.
                  </p>

                  {setupQrCode ? (
                    <div className="inline-block rounded-xl bg-white p-4">
                      <img
                        src={setupQrCode}
                        alt="Authenticator setup QR code"
                        className="w-52 h-52 object-contain"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Loading QR code...</p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="setup-code"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Authenticator Code
                  </label>

                  <input
                    id="setup-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={setupCode}
                    onChange={(e) =>
                      setSetupCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Enter 6-digit code"
                    disabled={loading}
                    autoFocus
                    className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-center tracking-[0.5em] text-xl text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <button
                  id="setup-verify-button"
                  type="submit"
                  disabled={loading || setupCode.length !== 6}
                  className="w-full h-12 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-[#07171F] disabled:bg-gray-600 disabled:text-gray-300"
                >
                  {loading ? "Verifying..." : "Verify & Enable MFA"}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  disabled={loading}
                  className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Back to Login
                </button>
              </form>
            ) : requiresMfa && isChangingMfa ? (
              <form onSubmit={handleVerifyNewPhone}>
                <div className="mb-5 text-center">
                  <p className="text-sm text-gray-300 mb-4">
                    Scan this QR code using the authenticator app on your new
                    phone.
                  </p>

                  {changeQrCode ? (
                    <div className="inline-block rounded-xl bg-white p-4">
                      <img
                        src={changeQrCode}
                        alt="New phone authenticator QR code"
                        className="w-52 h-52 object-contain"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Loading QR code...</p>
                  )}
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="new-phone-code"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Code from new phone
                  </label>

                  <input
                    id="new-phone-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={newPhoneCode}
                    onChange={(e) =>
                      setNewPhoneCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="Enter 6-digit code"
                    disabled={loading}
                    autoFocus
                    className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-center tracking-[0.5em] text-xl text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <button
                  id="new-phone-verify-button"
                  type="submit"
                  disabled={loading || newPhoneCode.length !== 6}
                  className="w-full h-12 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-[#07171F] disabled:bg-gray-600 disabled:text-gray-300"
                >
                  {loading ? "Verifying..." : "Verify & Replace Phone"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsChangingMfa(false);
                    setChangeQrCode("");
                    setNewPhoneCode("");
                    setError("");
                  }}
                  disabled={loading}
                  className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Cancel
                </button>
              </form>
            ) : !requiresMfa ? (
              <>
                {/* Username */}
                <div className="mb-5">
                  <label className="block text-sm text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    ref={usernameRef}
                    onKeyDown={handleKeyDown}
                    disabled={loading || loadConfig}
                    autoComplete="username"
                    className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    ref={passwordRef}
                    onKeyDown={handleKeyDown}
                    disabled={loading || loadConfig}
                    autoComplete="current-password"
                    className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading || loadConfig}
                  className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
                    loading
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-cyan-400 hover:bg-cyan-300 text-[#07171F]"
                  }`}
                >
                  {loading ? "Authenticating..." : "Login"}
                </button>
              </>
            ) : (
              // <form onSubmit={handleVerifyMfaLogin}>
              <form
                onSubmit={
                  mfaMethod === "authenticator"
                    ? handleVerifyMfaLogin
                    : handleVerifyOtpLogin
                }
              >
                {/* Select authentication method */}
                <div className="mb-5">
                  <label
                    htmlFor="mfa-method"
                    className="block text-sm text-gray-300 mb-2"
                  >
                    Choose Authentication Method
                  </label>

                  <select
                    id="mfa-method"
                    value={mfaMethod}
                    onChange={(e) => {
                      setMfaMethod(e.target.value);
                      setMfaCode("");
                      setOtpChallengeId("");
                      setOtpSent(false);
                      setError("");
                    }}
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="authenticator">Authenticator App</option>
                    <option value="email">Email OTP</option>
                    <option value="sms">SMS OTP</option>
                  </select>
                </div>

                {/* Email/SMS: request OTP before entering the code */}
                {mfaMethod !== "authenticator" && !otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full h-12 rounded-xl font-semibold bg-cyan-400 hover:bg-cyan-300 text-[#07171F] disabled:bg-gray-600 disabled:text-gray-300"
                  >
                    {loading
                      ? "Sending OTP..."
                      : mfaMethod === "email"
                        ? "Send Email OTP"
                        : "Send SMS OTP"}
                  </button>
                ) : (
                  <>
                    {/* Verification code */}
                    <div className="mb-6">
                      <label
                        htmlFor="mfa-code"
                        className="block text-sm text-gray-300 mb-2"
                      >
                        {mfaMethod === "authenticator"
                          ? "Authenticator Code"
                          : "Verification Code"}
                      </label>

                      <input
                        id="mfa-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={mfaCode}
                        onChange={(e) =>
                          setMfaCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        autoFocus
                        className="w-full h-12 rounded-xl bg-[#132F3B] border border-[#21414D] px-4 text-center tracking-[0.5em] text-xl text-white placeholder:text-gray-500 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>

                    <button
                      id="mfa-verify-button"
                      type="submit"
                      disabled={loading || mfaCode.length !== 6}
                      className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
                        loading || mfaCode.length !== 6
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-cyan-400 hover:bg-cyan-300 text-[#07171F]"
                      }`}
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>

                    {/* Resend OTP only for email/SMS */}
                    {mfaMethod !== "authenticator" && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full mt-3 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </>
                )}

                {/* Existing phone replacement option */}
                {mfaMethod === "authenticator" && (
                  <button
                    type="button"
                    onClick={handleStartMfaChange}
                    disabled={loading}
                    className="w-full mt-3 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                  >
                    Set up a new phone
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  disabled={loading}
                  className="w-full mt-4 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                >
                  Back to Login
                </button>
              </form>
            )}

            {/* Footer */}
            {/* <div className="mt-6 text-center text-xs text-white">
              © 2026{" "}
              <a
                href="https://www.revolvefintech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Revolve
              </a>
              . All rights reserved.
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
