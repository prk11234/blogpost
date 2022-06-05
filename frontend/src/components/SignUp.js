import React, { Component } from "react";

export default class SignUp extends Component {
    constructor(props)
    {
        super(props)
        this.state={
            first_name:"",
            last_name:"",
            email:"",
            password:"",
            access_level:"superadmin"
        }
        this.email_1="";
        this.warning_message=""
    }
    firstname(e)
    {
        this.setState({ first_name: e.target.value });
    }
    lastname(e)
    {
        this.setState({ last_name: e.target.value });
    }
    password(e)
    {
        this.setState({ password: e.target.value });
    }
    async email(e)
    {
        //this.email_1= e.target.value;
        console.log("email",e.target.value)
        this.setState({email:e.target.value})
        await fetch('/email_check', {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({email:e.target.value})
          }).then((response)=> {
            
            response.json().then((data)=> {
             if(data.length>0)
             {
             this.warning_message="Email already exist"
             this.setState({})

             }
             else
             {
             this.warning_message=""
             this.setState({})
             }
          })
          })
    }
    submitData()
    {
        //alert("called")
        var login_success=""
        fetch('/create_account', {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify(this.state)
          }).then(function(response) {
            
            return response.json();
          }).then(function(data) {
            // `data` is the parsed version of the JSON returned from the above endpoint.
            console.log("Data recieved",data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
            login_success=data;
          });
          if(login_success.length>0)
          {
              alert("Account created successfully.Please login")
              this.props.history.push({pathname:"/",state:{email:localStorage.getItem("MEME_LOGIN_EMAIL")}})
          }
          
    }
    accesslevel(e)
    {
        this.setState({access_level:e.target.value})
    }
    render() {
        return (
            <div className="outer">
        <div className="inner">
            <form>
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control" onChange={this.firstname.bind(this)} placeholder="First name" />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" onChange={this.lastname.bind(this)} placeholder="Last name" />
                </div>

                <div className="form-group">
                    
                    {this.warning_message.length>0?<label for="mail" style={{color:"red"}}>Email already exist</label>:<label>Email</label>}
                    <input type="email" className="form-control" onChange={this.email.bind(this)} placeholder="Enter email" title="this.warning_message" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" onChange={this.password.bind(this)} placeholder="Enter password" />
                </div>
                <div className="form-group">
                    <label>Access Level</label>
                    <br></br>
                    <select id="cars" onChange={this.accesslevel.bind(this)}>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="reader">Reader</option>
                    </select>
                              </div>

                {this.warning_message.length===0?<button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginTop:"8%"}} onClick={this.submitData.bind(this)}>Register</button>:<button type="submit" className="btn btn-dark btn-lg btn-block" style={{marginTop:"8%"}} disabled onClick={this.submitData.bind(this)}>Register</button>}
                <p className="forgot-password text-right    ">
                    Already registered <a href="http://localhost:3000/">log in?</a>
                </p>
            </form>
            </div>
            </div>
        );
    }
}