import { ENDPOINT } from "@/app/constant";
import { Logo } from "./Logo";
import { useAuth } from "@clerk/nextjs";

export const SuccessDisplay = ({sessionId}: {sessionId: string}) => {
    const { getToken } = useAuth();
    const createPortalSession = async (sessionId: string) => {

        const token = await getToken();
        console.log('sessionId in api call:', sessionId);
        const response = await fetch(`${ENDPOINT.PROD}/stripe/create-portal-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await response.json();
        console.log('portal session:', data);
        // redirect to stripe checkout page
        window.location.href = data.url;
    }
    return (
      <section>
        <div className="product Box-root">
          <Logo />
          <div className="description Box-root">
            <h3>Subscription to starter plan successful!</h3>
          </div>
        </div>
  
        <button id="checkout-and-portal-button" onClick={()=>createPortalSession(sessionId)}>
            Manage your billing information
        </button>
      </section>
    );
  };
  