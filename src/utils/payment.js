/**
 * Dynamically loads the Razorpay checkout.js script
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay payment with the backend
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in INR (e.g. 50)
 * @param {string} options.description - Payment description
 * @param {Object} [options.prefill] - Pre-filled user details (name, email, contact)
 */
export const triggerRazorpayPayment = async ({ amount, description, prefill = {} }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay payment SDK failed to load. Please check your internet connection.");
    return false;
  }

  try {
    // 1. Create order on local backend running on port 5000
    const response = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      throw new Error("Could not connect to backend server. Make sure it is running on port 5000.");
    }

    const order = await response.json();

    // 2. Open Razorpay Checkout modal
    return new Promise((resolve) => {
      const checkoutOptions = {
        key: "rzp_test_T7m9jM7QWggSt5", // Your public key ID
        amount: order.amount,
        currency: order.currency,
        name: "ASTRA X 2026",
        description: description || "Event Registration",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify signature on backend
            const verifyRes = await fetch("http://localhost:5000/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyResult = await verifyRes.json();
            if (verifyResult.status === "success") {
              alert("Payment successful! Registration verified.");
              resolve({ success: true, response });
            } else {
              alert("Payment verification failed: " + (verifyResult.message || "Invalid signature"));
              resolve({ success: false, error: "Signature verification failed" });
            }
          } catch (err) {
            console.error(err);
            alert("Error during payment verification: " + err.message);
            resolve({ success: false, error: err.message });
          }
        },
        prefill: {
          name: prefill.name || "",
          email: prefill.email || "",
          contact: prefill.contact || ""
        },
        theme: {
          color: "#dfb24f" // Gold branding color matching Astra X
        },
        modal: {
          ondismiss: function () {
            resolve({ success: false, error: "Checkout closed by user" });
          }
        }
      };

      const paymentObject = new window.Razorpay(checkoutOptions);
      paymentObject.open();
    });
  } catch (error) {
    console.error("Payment initiation failed:", error);
    alert(`Payment failed to start: ${error.message}`);
    return false;
  }
};
