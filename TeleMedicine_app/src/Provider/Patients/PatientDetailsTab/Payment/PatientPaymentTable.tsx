import "./PatientPaymentTable.css";
interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  doctor: string;
  fee: number;
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

const PatientPaymentTable: React.FC = () => {
  const patients: Patient[] = [
    {
      id: 3,
      name: "Amit Deshmukh",
      age: 45,
      gender: "Male",
      doctor: "Dr. Sharma",
      fee: 500,
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      age: 34,
      gender: "Female",
      doctor: "Dr. Verma",
      fee: 600,
    },
    {
      id: 5,
      name: "Robert D'Souza",
      age: 52,
      gender: "Male",
      doctor: "Dr. Mehta",
      fee: 700,
    },
    {
      id: 6,
      name: "Ananya Iyer",
      age: 29,
      gender: "Female",
      doctor: "Dr. Gupta",
      fee: 450,
    },
    {
      id: 7,
      name: "Vikram Singh",
      age: 38,
      gender: "Male",
      doctor: "Dr. Sharma",
      fee: 500,
    },
    {
      id: 8,
      name: "Meera Joshi",
      age: 61,
      gender: "Female",
      doctor: "Dr. Mehta",
      fee: 700,
    },
    {
      id: 9,
      name: "Rahul Kapoor",
      age: 25,
      gender: "Male",
      doctor: "Dr. Verma",
      fee: 600,
    },
    {
      id: 10,
      name: "Zoya Khan",
      age: 31,
      gender: "Female",
      doctor: "Dr. Gupta",
      fee: 450,
    },
    {
      id: 11,
      name: "Arjun Rao",
      age: 42,
      gender: "Male",
      doctor: "Dr. Mehta",
      fee: 700,
    },
    {
      id: 12,
      name: "Pooja Nair",
      age: 27,
      gender: "Female",
      doctor: "Dr. Verma",
      fee: 600, 
    },
  ];
  const handlePayment = (amount: number, patientName: string) => {
    const options = {
      key: "rzp_test_SUfgFLw5Q7PAIs",
      amount: amount * 100,
      currency: "INR",
      name: "TeleMed",
      description: `Consultation fees for ${patientName}`,
      handleer: function (response: RazorpayResponse) {
        console.log("Payment Success:", response);

        alert(`Payment successful for ${patientName}`);
      },
      prefill: {
        name: patientName,
        email: "patient@test.com",
        contact: "9999999999",
      },

      theme: {
        color: "#2f80ed",
      },
    };
    const rzp = new (window as any).Razorpay(options);

    rzp.open();
  };
  return (
    <div className="table-container">
      <h2 className="title">Patient Consultation Payment</h2>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Doctor</th>
            <th>Fee (₹)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.doctor}</td>
              <td>₹{patient.fee}</td>

              <td>
                <button
                  className="pay-btn"
                  onClick={() => handlePayment(patient.fee, patient.name)}
                >
                  Pay Consultation Fee
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PatientPaymentTable;
