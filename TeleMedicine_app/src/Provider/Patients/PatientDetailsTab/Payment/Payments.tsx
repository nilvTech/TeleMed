import PatientPaymentTable from "./PatientPaymentTable";

function Payments(){
    return(
        <div>
        <PatientPaymentTable/>
        </div>
    )
}
export default Payments;

// interface RazorpayResponse {
//   razorpay_payment_id: string;
//   razorpay_order_id?: string;
//   razorpay_signature?: string;
// }

export const RazorpayPayment = () => {

  // const handlePayment = () => {

  //   const options = {
  //     key: "rzp_test_SUfgFLw5Q7PAIs", // Your Test Key ID

  //     amount: 50000, // 500 INR (amount in paise)

  //     currency: "INR",

  //     name: "TeleMed",

  //     description: "Doctor Consultation Fee",

  //     image: "https://yourlogo.com/logo.png",

  //     handler: function (response:RazorpayResponse) {
  //       console.log("Payment Success:", response);

  //       alert("Payment Successful!");
  //     },

  //     prefill: {
  //       name: "Patient Name",
  //       email: "patient@test.com",
  //       contact: "9999999999",
  //     },

  //     notes: {
  //       appointmentId: "APT123",
  //     },

  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };

  //   const rzp = new (window as any).Razorpay(options);

  //   rzp.open();
  // };

  // return (
  //   <button onClick={handlePayment}>
  //     Pay Consultation Fee
  //   </button>
  // );
};