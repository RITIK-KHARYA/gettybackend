import { Context } from "hono"
import { auth } from "./auth"

export const getServerSession = async(c:Context)=>{
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    })
    console.log(session)
    if(!session){
        return {
            session: null,
            user: null
        }  
    }
   return {
    session: session.session,
    user: session.user
   }
}
