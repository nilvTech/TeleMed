function SignUp(){
    return(
        <>  
                    <div className='form'>
                        <h2>Register</h2>
                        <input type="email" placeholder='Email Address' required/>
                        <input type="password" placeholder='Password' required />
                        <input type="password" placeholder='Confirm Password' required />
                        <button className="AuthSubmitBtn">Register</button>
                    </div>
                    </>
    )
}
export default SignUp;