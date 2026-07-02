export default function SignIn(){
    return(
        <form action="/signin" method="POST">
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Sign In</button>
        </form>
    )
}