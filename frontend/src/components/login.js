import React from "react";
import "./login.css"

export default class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display_super_admin:"none",
      display_admin:"none",
      randomImg: "",
      textAreaValue:"",
      total_request_images:[],
      total_request_images_admin:[],
      total_update_images_admin:[],
      email_current_login: (localStorage.getItem("MEME_LOGIN_EMAIL")),
      total_images:[],
      view_blogs:true,
      super_admin_write:false,
      super_admin_review:false,
      super_admin_gu:false,
      super_admin_gb:false,
      admin_write:false,
      admin_save:false,
      admin_update:false,
      image_file:{},
      login_account_details:[{}]
    };
  }
  onFileChange = (e) => {
    const [file] = e.target.files;
    this.setState({image_file:e.target.files[0],randomImg:URL.createObjectURL(file)})
  };
  async get_all_images()
  {
    this.state.total_images=[];
    this.state.total_request_images=[];
    await fetch('/get_all_photo').then((response)=> {
      response.json().then((data)=> {
     for(let i=0;i<data.length;i++)
     {
      console.log("All value",data[i])
      if(data[i].photo_publish.length>0)
      {
        this.setState({total_images:this.state.total_images.concat(data[i].photo_publish)})
      }
      if(data[i].photo_publish_request.length>0)
      {
        console.log("requested array value",data[i].photo_publish_request)
        this.setState({total_request_images:this.state.total_request_images.concat(data[i].photo_publish_request)})
      }
     }
     })
      })
  }
  async componentDidMount() {
    this.setState({ email_current_login: localStorage.getItem("MEME_LOGIN_EMAIL") })
    this.get_all_images();
    this.getaccountdetail();
  }
  Logout() {
    localStorage.removeItem("MEME_LOGIN_EMAIL")
    this.props.history.push({ pathname: "/", state: { email: "" } })
  }
  handleChange(e)
  {
    this.setState({textAreaValue:e.target.value})
  }
  async publish_blog()
  {
    const data = new FormData();

    data.append("image", this.state.image_file);
    data.append("text_data", this.state.textAreaValue);
    data.append("email",this.state.email_current_login);
    await fetch('/publish_photo', {
      method: "POST",
      body:data
    }).then((response)=> {
      if(response.status==200)
      {
      this.setState({view_blogs:true,
        super_admin_write:false,
        super_admin_review:false,
        super_admin_gu:false,
        super_admin_gb:false,
        admin_write:false,
        admin_save:false,
        admin_update:false})
        this.get_all_images();
      }
    })
  }
  async request_blog()
  {
    const data = new FormData();
    data.append("image", this.state.image_file);
    data.append("text_data", this.state.textAreaValue);
    data.append("email",this.state.email_current_login);
    await fetch('/request_photo', {
      method: "POST",
      body:data
    }).then((response)=> {
      this.get_all_images();
    })
  }
  async getaccountdetail()
  {
    await fetch('/full_account_details', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:localStorage.getItem("MEME_LOGIN_EMAIL")})
    }).then((response)=> {
    console.log("response",response)
    response.json().then(data=>{
      console.log("data",data)
      this.setState({login_account_details:data})
    })
    })
  }
  view_read_blog()
  {
    this.setState({view_blogs:true,
      super_admin_write:false,
      super_admin_review:false,
      super_admin_gu:false,
      super_admin_gb:false,
      admin_write:false,
      admin_save:false,
      admin_update:false})
  }
  superad_write()
  {
    this.setState({view_blogs:false,
      super_admin_write:true,
      super_admin_review:false,
      super_admin_gu:false,
      super_admin_gb:false,
      admin_write:false,
      admin_save:false,
      admin_update:false})
  }
  superad_review()
  {
    this.setState({view_blogs:false,
      super_admin_write:false,
      super_admin_review:true,
      super_admin_gu:false,
      super_admin_gb:false,
      admin_write:false,
      admin_save:false,
      admin_update:false})
  }
  superad_gu()
  {
    this.setState({view_blogs:false,
      super_admin_write:false,
      super_admin_review:false,
      super_admin_gu:true,
      super_admin_gb:false,
      admin_write:false,
      admin_save:false,
      admin_update:false})
  }
  superad_gb()
  {
    this.setState({view_blogs:false,
      super_admin_write:false,
      super_admin_review:false,
      super_admin_gu:false,
      super_admin_gb:true,
      admin_write:false,
      admin_save:false,
      admin_update:false})
      this.get_all_images();
  }
  ad_write()
  {
    this.setState({view_blogs:false,
      super_admin_write:false,
      super_admin_review:false,
      super_admin_gu:false,
      super_admin_gb:false,
      admin_write:true,
      admin_save:false,
      admin_update:false})
  }
  async ad_save()
  {
    this.setState({view_blogs:false,
      super_admin_write:false,
      super_admin_review:false,
      super_admin_gu:false,
      super_admin_gb:false,
      admin_write:false,
      admin_save:true,
      admin_update:false})
      await fetch('/admin_saved_article', {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({email:localStorage.getItem("MEME_LOGIN_EMAIL")})
      }).then((response)=> {
      console.log("response",response)
      response.json().then(data=>{
        console.log("data",data)
        this.setState({total_request_images_admin:data[0].photo_publish_request})
      })
      })

  }
  async give_blog_access(e)
  {
    await fetch('/provideblogaccess', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:e.data})
    }).then((response)=> {
      if(response.status==200)
      {
          this.get_all_images();
      }
    })
  }
  async deny_blog_access(e)
  {
    await fetch('/denyblogaccess', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:e.data})
    }).then((response)=> {
      if(response.status==200)
      { 
          this.get_all_images();
      }
    })
  }
  async delete_blog(e)
  {
    await fetch('/deleteblog', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:e.data})
    }).then((response)=> {
      console.log("delete reponse",response);
      if(response.status==200)
      {
          this.get_all_images();
          this.setState({})
      }
    })
  }
  async update_blog(e)
  {
    this.state.total_update_images_admin=[]
      this.state.total_update_images_admin.push(e);
      this.setState({view_blogs:false,
        super_admin_write:false,
        super_admin_review:false,
        super_admin_gu:false,
        super_admin_gb:false,
        admin_write:false,
        admin_save:false,
        admin_update:true})
        console.log("update",this.state.total_update_images_admin)

  }
  displayblock()
  {
    this.setState({display_super_admin: 'block'});
  }
  hideblock()
  {
    this.setState({display_super_admin: 'none'});
  }
  async give_update_access(e)
  {
    await fetch('/provideupdateaccess', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:e.data})
    }).then((response)=> {
      if(response.status==200)
      {
          this.get_all_images();
      }
    })
  }
  async deny_update_access(e)
  {
    await fetch('/denyupdateaccess', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:e.data})
    }).then((response)=> {
      if(response.status==200)
      {
          this.get_all_images();
      }
    })
  }

  async update_final_blog(e)
  {
    if(this.state.login_account_details[0].accesslevel==="admin")
    {
    await fetch('/updateblogaccess', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:this.state.textAreaValue})
    }).then((response)=> {
      if(response.status==200)
      {
        this.setState({view_blogs:true,
          super_admin_write:false,
          super_admin_review:false,
          super_admin_gu:false,
          super_admin_gb:false,
          admin_write:false,
          admin_save:false,
          admin_update:false})
          this.get_all_images();
      }
    })
  }
  else
  {
    await fetch('/finalupdateblogaccess', {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({email:e.email,url:e.url,data:this.state.textAreaValue})
    }).then((response)=> {
      if(response.status==200)
      {
        this.setState({view_blogs:true,
          super_admin_write:false,
          super_admin_review:false,
          super_admin_gu:false,
          super_admin_gb:false,
          admin_write:false,
          admin_save:false,
          admin_update:false})
          this.get_all_images();
      }
    })
  }
  }
  render() {
    return (
      <div class="login" style={{display:"flex",flexFlow: "column"}}>
        <div style={{ backgroundColor: "blue",display:"flex",flexFlow: "row" }}>
          <div style={{marginLeft:"10px"}}>
            <h5 style={{ color: "white" }}>
              Let everyone know what is Inside your mind with your blogs
            </h5>
          </div>
          <div style={{marginLeft:"230px"}}>
          <button
              
              style={{ background: "grey", color: "white", border: "blue"}}
              onClick={this.view_read_blog.bind(this)}
            >
              View All Blogs
            </button> 
          </div>
          {this.state.login_account_details[0].accesslevel=="superadmin"?
          <div class="super_admin" style={{marginLeft:"30px"}} onMouseEnter={this.displayblock.bind(this)}
                 onMouseLeave={this.hideblock.bind(this)}>
            <button
              
              style={{ background: "grey", color: "white", border: "blue"}}
            >
              Super Admin
            </button>
            <div style={{display:this.state.display_super_admin,background:"white",zIndex:"3",position:"absolute"}}>
            <div style={{display:"flex",flexFlow: "column"}}>
            <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.superad_write.bind(this)}
              
            >
              Write
            </button>
            
            <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.superad_review.bind(this)}
            >
              Review
            </button>
            <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.superad_gb.bind(this)}
            >
              Grant Blogs
            </button>
            </div>
            </div>
          </div>:null}
          
          {this.state.login_account_details[0].accesslevel=="admin"?<div class="admin" style={{marginLeft:"30px"}} onMouseEnter={e => {
                     this.setState({display_admin: 'block'});
                 }}
                 onMouseLeave={e => {
                  this.setState({display_admin: 'none'});
                 }}>
            <button
              
              style={{ background: "grey", color: "white", border: "blue"}}
            >
              Admin
            </button>
            <div style={{display:this.state.display_admin,background:"white",zIndex:"3",position:"absolute"}}>
            <div style={{display:"flex",flexFlow: "column"}}>
            <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.ad_write.bind(this)}
            >
              Write
            </button>
            <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.ad_save.bind(this)}
            >
              Saved Article
            </button>
            </div>
            </div>
          </div>:null}
          <div class="reader" style={{marginLeft:"30px"}}>
          <button onClick={this.Logout.bind(this)} style={{ background: "grey", color: "white", border: "blue" }}> Logout</button>
        </div>
        </div>
         {/* Display all blogs for all users*/}
                 {this.state.view_blogs==true&&this.state.total_images.length>0?<div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",marginTop:"30px"}}>
                   {this.state.total_images.map((imagees)=>
                   {
                     return(
              
                  <div style={{marginLeft:"10px",marginTop:"10px"}}>
                
                   <img src={require("../../../photos/"+imagees.url)} alt="" height="270" width="300"/>
                   
                    <p> {imagees.data} </p>
                    <div style={{display:"flex",flexDirection:"column"}}>
                    {this.state.login_account_details[0].accesslevel==="superadmin"||(this.state.login_account_details[0].accesslevel==="admin"&&(this.state.login_account_details[0].photo_publish.filter(e=>e.url===imagees.url)).length>0)?<button value={imagees} onClick={e=>this.update_blog(imagees)} style={{marginLeft:"140px"}}>Update Blog</button>:null}
                    {this.state.login_account_details[0].accesslevel==="superadmin"||(this.state.login_account_details[0].accesslevel==="admin"&&(this.state.login_account_details[0].photo_publish.filter(e=>e.url===imagees.url)).length>0)?<button value={imagees} onClick={e=>this.delete_blog(imagees)} style={{marginLeft:"140px",marginTop:"10px"}}>Delete Blog</button>:null}
                      </div>
                      </div>
                   
                     )
                   }
                   )}
                   </div>:null}
          {/* End of display all blogs for all users*/}
        {/* Display write the post section for super admin*/}
        {this.state.super_admin_write==true?
        <div style={{marginTop:"5%",marginLeft:"10%",display:"flex",flex:"row"}}>
          <p><b>Add Image:</b></p>
        <input type="file" onChange={this.onFileChange.bind(this)} />
        {this.state.randomImg.length>0?<div style={{display:"flex",flexDirection:"column"}}>
        <div>
        <img src={this.state.randomImg} alt="" height="300" width="390"/> 
        </div>
        <div>
        <textarea value={this.state.textAreaValue} onChange={this.handleChange.bind(this)} placeholder="Write something about your post" rows="4" cols="50"/>
        </div>
        <div>
        <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.publish_blog.bind(this)}
            >
              Publish your blog
            </button>
        </div>
        </div>:null
        }
          </div>:null}
        {/* End of display write the post section*/}
        {/* Display write the post section for admin*/}
        {this.state.admin_write==true?
        <div style={{marginTop:"5%",marginLeft:"10%",display:"flex",flex:"row"}}>
          <p><b>Add Image:</b></p>
        <input type="file" onChange={this.onFileChange.bind(this)} />
        {this.state.randomImg.length>0?<div style={{display:"flex",flexDirection:"column"}}>
        <div>
        <img src={this.state.randomImg} alt="" height="300" width="390"/> 
        </div>
        <div>
        <textarea value={this.state.textAreaValue} onChange={this.handleChange.bind(this)} placeholder="Write something about your post" rows="4" cols="50"/>
        </div>
        <div>
        <button
              
              style={{ background: "grey", color: "white", marginTop:"10px"}}
              onClick={this.request_blog.bind(this)}
            >
              Request for publish
            </button>
        </div>
        </div>:null
        }
          </div>:null}
        {/* End of display write the post section for admin*/}
        {/* Display all blogs for review by super admin*/}
        {this.state.super_admin_review==true&&this.state.total_request_images.length>0?<div>
                   {this.state.total_request_images.map((imagees)=>
                   {
                     return(
                  imagees.superadmin_update_request===null? <div><img src={require("../../../photos/"+imagees.url)} alt="" height="300" width="390"/><p>{imagees.data}</p><button value={imagees} onClick={e=>this.give_update_access(imagees)} style={{marginLeft:"140px"}}>Update</button><button onClick={e=>this.deny_update_access(imagees)} style={{marginLeft:"10px"}}>Deny</button> </div>:null
                   
                     )
                   }
                   )}
                   </div>:null}
          {/* End of Display all blogs for review by super admin*/}
         {/* Display all blogs requested to be posted by admin*/}
         {this.state.super_admin_gb==true&&this.state.total_request_images.length>0?<div>
                   {this.state.total_request_images.map((imagees)=>
                   {
                     return(
                  imagees.superadmin_grant_request===null? <div><img src={require("../../../photos/"+imagees.url)} alt="" height="300" width="390"/><p>{imagees.data}</p><button value={imagees} onClick={e=>this.give_blog_access(imagees)} style={{marginLeft:"140px"}}>Publish</button><button onClick={e=>this.deny_blog_access(imagees)} style={{marginLeft:"10px"}}>Deny</button> </div>:null
                   
                     )
                   }
                   )}
                   </div>:null}
          {/* End of Display all blogs requested to be posted by admin*/}
           {/* Display all blogs requested to be posted by admin*/}
         {this.state.admin_save==true&&this.state.total_request_images_admin.length>0?<div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",marginTop:"30px"}}> 
                   {this.state.total_request_images_admin.map((imagees)=>
                   {
                     return(
                   <div style={{marginLeft:"10px",marginTop:"10px"}}><img src={require("../../../photos/"+imagees.url)} alt="" height="300" width="390"/><p>{imagees.data}</p><p>{imagees.superadmin_grant_request==null?"Status : Pending":imagees.superadmin_grant_request==true?"Status : Published":"Status : Denied by Super Admin"}</p> </div>
                   
                     )
                   }
                   )}
                   </div>:null}
          {/* End of Display all blogs requested to be posted by admin*/}
          {/* Display all blogs requested to be posted by admin*/}
         {this.state.admin_update==true&&this.state.total_update_images_admin.length>0?<div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",marginTop:"30px"}}> 
                   {this.state.total_update_images_admin.map((imagees)=>
                   {
                     return(
                   <div style={{marginLeft:"400px",marginTop:"10px",display:"flex",flexDirection:"column"}}><img src={require("../../../photos/"+imagees.url)} alt="" height="300" width="390"/><textarea value={this.state.textAreaValue} onChange={this.handleChange.bind(this)} placeholder="Update your post" rows="4" cols="50"/> 
                   <button value={imagees} onClick={e=>this.update_final_blog(imagees)} style={{marginTop:"20px"}}>{this.state.login_account_details[0].accesslevel==="superadmin"?"Update Changes":"Send changes for update"}</button>
                  
                   </div>
                   
                     )
                   }
                   )}
                   </div>:null}
          {/* End of Display all blogs requested to be posted by admin*/}
        <div>

        </div>
      </div>);
  }
}
