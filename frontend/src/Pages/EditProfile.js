import '../css/EditProfile.css';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { useState, useEffect } from 'react';
import callrefresh from '../refresh.js';
import React from "react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";


const EditProfile = () => {
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    // 修改個人資料
    const calluserupdate = async (e) => {
        e.preventDefault();
        const getprotected = await fetch('http://127.0.0.1:5000/UserUpdate',{
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name : last_name,
                password : password,
                password2 : password2,
            }),
        });
        console.log(getprotected.status);
        if(getprotected.status === 401){
            callrefresh();
        }else{
            const resdata = await getprotected.json();
            console.log(resdata);
            console.log(resdata.message);
            alert(resdata.message);
        }
    };
    
    const [Profile, setProfile] = useState([]);
    useEffect(() => {
        const callGetUserProfile = async () => {
            const data = await fetch('http://127.0.0.1:5000/GetUserProfile',{
                method: 'GET',
                headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            console.log(data.status);
            if(data.status === 401){
                callrefresh("reload");
            }else{
                const dataJSON = await data.json();
                console.log(dataJSON);
                setProfile(dataJSON[0]);
            }            
        };
        callGetUserProfile();
    }, []);

    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
      });
      
      const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
      };
      
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
      

      const [values2, setValues2] = React.useState({
        password: "",
        showPassword: false,
      });
      
      const handleClickShowPassword2 = () => {
        setValues2({ ...values2, showPassword: !values2.showPassword });
      };
      
      const handleMouseDownPassword2 = (event) => {
        event.preventDefault();
      };

      let errors = {};

      if (password.length < 8) {
        errors.errorpwd = '密碼長度至少8碼以上！';
    }
    else{
        errors.correctpwd = '可使用的密碼！';
    }

    const callAlert = () => {
        alert('請輸入正確格式的密碼！')
    }

    return (
    <>
    <Navbar/>
     <div className="edit_card_container" align='center'>
            
            <div className="edit_card_right">
                <div className="edit_input_content">
                    <h1>編輯個人資訊</h1>
                </div>
                <div className="edit_input_content">
                    <h2>你的信箱</h2>
                    <h3>{Profile.user_email}</h3>
                </div>
                <div className="edit_input_content">
                    <h3>姓氏</h3>
                    <input maxLength="45" defaultValue = {Profile.user_lastname} onChange={(e) => setLastname(e.target.value)} type="text" placeholder="LastName" className="edit_inputbar"/>
                    </div>
                <div className="edit_input_content">
                    <h3>名字</h3>
                    <input maxLength="45" defaultValue = {Profile.user_firstname} onChange={(e) => setFirstname(e.target.value)} type="text" placeholder="FirstName" className="edit_inputbar"/>
                </div>

                <div className="edit_input_content">
                    <h3>輸入新密碼</h3>
                    <div className='edit-password-content'>
                        <input type={values.showPassword ? "text" : "password"} value={password} placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} className="edit_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                            {values.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                        {(password.length>0 && errors.errorpwd) && <font>{errors.errorpwd}</font>}
                        {errors.correctpwd && <text>{errors.correctpwd}</text>}
                    </div>
                </div>
                <div className="edit_input_content">
                    <h3>確認新密碼</h3>
                    <div className='edit-password-content'>
                        <input type={values2.showPassword ? "text" : "password"} value={password2} placeholder="Password" 
                        onChange={(e) => setPassword2(e.target.value)} className="edit_inputbar"/>
                        <button className='eye' onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword2}>
                            {values2.showPassword ? <AiFillEye size='20px'/> : <AiFillEyeInvisible size='20px'/>}
                        </button>
                    </div>
                </div>
                
            <form>
                {errors.errorpwd && <button className="Btn edit_submit" onClick={callAlert}>修改</button>}
                {errors.correctpwd && <button className="Btn edit_submit" onClick={calluserupdate}>修改</button>}
                {/* <button className="Btn edit_submit" onClick={calluserupdate}>修改</button> */}
            </form>
            
            </div>
        </div>
        <Footer/>
    </>
    )
}

export { EditProfile };