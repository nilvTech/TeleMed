function SignUp(){
    return(
        <>  
                    <div className='form'>
                        <h2>Register</h2>
                        <input type="email" placeholder='Email Address' />
                        <input type="password" placeholder='Password' />
                        <input type="password" placeholder='Confirm Password' />
                        <button className="AuthSubmitBtn">Register</button>
                    </div>
                    </>
    )
}
export default SignUp;