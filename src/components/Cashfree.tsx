// import { load } from "@cashfreepayments/cashfree-js";

// function Checkout() {
//   let cashfree;
//   var initializeSDK = async function () {
//     cashfree = await load({
//       mode: "production",
//     });
//   };
//   initializeSDK();

//   const doPayment = async () => {
//     let checkoutOptions = {
//       paymentSessionId: "your-payment-session-id",
//       redirectTarget: "_self",
//     };
//     cashfree.checkout(checkoutOptions);
//   };

//   return (
//     <div class="row">
//       <p>Click below to open the checkout page in current tab</p>
//       <button type="submit" class="btn btn-primary" id="renderBtn" onClick={doPayment}>
//         Pay Now
//       </button>
//     </div>
//   );
// }
// export default Checkout;