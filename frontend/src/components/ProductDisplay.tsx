import { ENDPOINT } from "@/app/constant";
import { Logo } from "./Logo";
import { useAuth } from "@clerk/nextjs";
export const ProductDisplay = () => {
    const { getToken } = useAuth();
    const createCheckoutSession = async () => {
        const token = await getToken();
        const response = await fetch(`${ENDPOINT.PROD}/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ lookup_key: undefined }),
        });
        const data = await response.json();
        console.log('data:', data);
        // redirect to stripe checkout page
        window.location.href = data.url;
    }
    
    return (
        <section>
            <div className="product">
                <Logo />
                <div className="description">
                <h3>Starter plan</h3>
                <h5>$20.00 / month</h5>
                </div>
            </div>
            <button id="checkout-and-portal-button" onClick={createCheckoutSession}>
                Checkout
            </button>
        </section>
    )
};
  