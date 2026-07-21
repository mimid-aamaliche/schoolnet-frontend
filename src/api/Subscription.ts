//get the api url and form the subscribtion endpoint
import { ApiURL } from "../api/ApiConf";
const SubscribtionEndpoint = `${ApiURL}Subscribtion`;



export const handleSubscribe = async (courseId:number) => {
  try {
    const response = await fetch(`${SubscribtionEndpoint}/Pay`, {
      method: "POST",
      credentials: "include", // sends the http-only cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseId),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Payment failed:", error);
      return;
    }

    const { checkout_url } = await response.json();
    window.location.href = checkout_url;  
    
    
  } catch (err) {
    console.error("Network error:", err);
  }
};