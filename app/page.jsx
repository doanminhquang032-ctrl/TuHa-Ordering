'use client';
import React from "react";

const API_URL = "DÁN_API_URL";
const ADMIN_PASS = "1234";

export default function App() {
  const role = new URLSearchParams(window.location.search).get("role") || "customer";

  if (role === "admin") return <Admin />;
  if (role === "kitchen") return <Kitchen />;
  if (role === "dashboard") return <Dashboard />;
  return <Customer />;
}

// ===== CUSTOMER =====
function Customer(){
  const [menu,setMenu]=React.useState([]);
  const [cart,setCart]=React.useState([]);

  React.useEffect(()=>{
    fetch(API_URL+"?type=menu").then(r=>r.json()).then(d=>{
      setMenu(d.map(m=>({id:m[0],name:m[1],price:m[2],img:m[3]})))
    });
  },[]);

  const add=(m)=>{
    const ex=cart.find(i=>i.id===m.id);
    if(ex) ex.qty++;
    else cart.push({...m,qty:1});
    setCart([...cart]);
  }

  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);

  const order=async()=>{
    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({type:"order",cart,total})
    });
    alert("Đặt xong");
    setCart([]);
  }

  return (
    <div>
      <h1>🍜 Menu</h1>
      {menu.map(m=>(
        <div key={m.id}>
          <img src={m.img} width="100"/>
          <p>{m.name} - {m.price}</p>
          <button onClick={()=>add(m)}>Thêm</button>
        </div>
      ))}
      <h2>🛒</h2>
      {cart.map(i=><p key={i.id}>{i.name} x{i.qty}</p>)}
      <p>{total}</p>
      <button onClick={order}>Đặt</button>
    </div>
  );
}

// ===== ADMIN =====
function Admin(){
  const [login,setLogin]=React.useState(false);
  const [pass,setPass]=React.useState("");

  const [menu,setMenu]=React.useState([]);
  const [name,setName]=React.useState("");
  const [price,setPrice]=React.useState("");
  const [img,setImg]=React.useState("");

  React.useEffect(()=>{
    if(login){
      fetch(API_URL+"?type=menu").then(r=>r.json()).then(setMenu);
    }
  },[login]);

  if(!login){
    return (
      <div>
        <h2>🔐 Login</h2>
        <input onChange={e=>setPass(e.target.value)}/>
        <button onClick={()=>setLogin(pass===ADMIN_PASS)}>Login</button>
      </div>
    )
  }

  const add=()=>{
    fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({type:"menu_add",name,price,img})
    });
  }

  const update=(id)=>{
    fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({type:"menu_update",id,name,price,img})
    });
  }

  return (
    <div>
      <h1>⚙️ Admin</h1>

      <input placeholder="Tên" onChange={e=>setName(e.target.value)}/>
      <input placeholder="Giá" onChange={e=>setPrice(e.target.value)}/>
      <input placeholder="Link ảnh" onChange={e=>setImg(e.target.value)}/>
      <button onClick={add}>Thêm</button>

      <h2>Menu</h2>
      {menu.map(m=>(
        <div key={m[0]}>
          <p>{m[1]} - {m[2]}</p>
          <button onClick={()=>update(m[0])}>Sửa</button>
        </div>
      ))}
    </div>
  )
}

// ===== KITCHEN =====
function Kitchen(){
  const [orders,setOrders]=React.useState([]);

  React.useEffect(()=>{
    fetch(API_URL+"?type=orders").then(r=>r.json()).then(setOrders);
  },[]);

  return (
    <div>
      <h1>👨‍🍳</h1>
      {orders.map((o,i)=>(
        <div key={i}>
          <p>{o[1]}</p>
          <p>{o[4]}</p>
        </div>
      ))}
    </div>
  );
}

// ===== DASHBOARD =====
function Dashboard(){
  const [orders,setOrders]=React.useState([]);

  React.useEffect(()=>{
    fetch(API_URL+"?type=orders").then(r=>r.json()).then(setOrders);
  },[]);

  const rev=orders.reduce((s,o)=>s+Number(o[3]||0),0);

  return (
    <div>
      <h1>📊</h1>
      <p>Đơn: {orders.length}</p>
      <p>Doanh thu: {rev}</p>
    </div>
  );
}
