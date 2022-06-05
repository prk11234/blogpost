import React from "react";
import './App.css';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
class App1 extends React.Component {
  constructor(props)
  {
    super(props)
    this.state={email:"",password:""}
    this.email_1="";
    this.password_1="";
    this.array_users=[];
  }
  componentDidMount()
  {
    console.log("array users",this.array_users)
    if(localStorage.getItem("MEME_LOGIN_EMAIL")!==null){
    if(localStorage.getItem("MEME_LOGIN_EMAIL").length>0)
    this.props.history.push({pathname:"/login_success",state:{email:localStorage.getItem("MEME_LOGIN_EMAIL")}})
    }
  
  }
 SuccessSignin()
  {
    console.log("array users",this.array_users)
    if(this.array_users.length>0)
    {
      localStorage.setItem("MEME_LOGIN_EMAIL",this.email_1)
      this.props.history.push({pathname:"/login_success",state:{email:this.array_users[0].email}})
    }
    else
    {
      alert("Invalid username or password")
      localStorage.removeItem("MEME_LOGIN_EMAIL")
      this.props.history.push({pathname:"/"})
    }
  }
  Createaccount()
  {
    this.props.history.push({pathname:"/account_create"})
  }
  async password(e)
  {
      this.password_1= e.target.value ;
      var abc=[]
      await fetch('/signin_account', {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({email:this.email_1,password:this.password_1})
      }).then((response)=> {
        
        response.json().then((data)=> {
         if(data.length>0)
         this.array_users=data
      })
      })
      
      
  }
  async email(e)
  {
      this.email_1= e.target.value;
      var abc=[]
      await fetch('/signin_account', {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({email:this.email_1,password:this.password_1})
      }).then((response)=> {
        
        response.json().then((data)=> {
          if(data.length>0)
          {
          console.log("Data recieved",data)
          this.array_users=data 
          }
          else{
            this.array_users=[]
          } 
      })
      })  
  }
  render()
  {
  return (
    <div className="App">
          <div className="outer">
        <div className="inner">
       <form>

<h3>Log in</h3>

<div className="form-group">
    <label>Email</label>
    <input type="email" className="form-control" autocomplete="off" onChange={this.email.bind(this)} placeholder="Enter email" />
</div>

<div className="form-group">
    <label>Password</label>
    <input type="password" className="form-control" autocomplete="off" onChange={this.password.bind(this)} placeholder="Enter password" />
</div>

<button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginTop:"8%"}} onClick={this.SuccessSignin.bind(this)}>Sign in</button>

<button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginTop:"8%",marginLeft:"20%"}} onClick={this.Createaccount.bind(this)}>Create Account</button>
</form>
</div>
</div>
     
    </div>
  );
  }
}
export default withRouter(App1)
