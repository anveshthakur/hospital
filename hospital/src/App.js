import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Alert } from 'antd';
import 'antd/dist/antd.css';
import Web3 from 'web3';
import Hospital from './abis/Hospital.json'
import Navbar from './Components/Navbar/navbar'
import './App.css'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 10,
  },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      Hospital: null,
      address: null,
      loading: true,
      adr: null,
      data: null,
    }
  }


  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  onFinish = (values) => {
    this.setState({loading: true});
    const data = values.user;
    console.log(data);
    this.state.Hospital.methods.registerUser(
      this.state.account,
      data.name,
      data.phone,
      data.email,
      1,
      data.age,
      data.symptoms,
    ).send({from: this.state.account}).on('transactionHash', (Hash) => {
      this.setState({loading: false});
    })
  };

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable();
    }
    else if(window.web3) window.web3 = new Web3(window.web3.currentProvider);
    else window.alert('Non-Etherium browser detected. You Should consider trying MetaMask!');
  }

  async loadBlockchainData(){
    const web3 = window.web3;
    const accounts =  await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    const networkId = await web3.eth.net.getId();
    const networkData = Hospital.networks[5777];
    
    console.log(networkData);

    // this.setState({address : networkData.address});

    // if(networkData){
    //   const hospital = new web3.eth.Contract(Hospital.abi, networkData.address);
    //   this.setState({Hospital: hospital});
    //   const pateintCount = await hospital.methods.totalPatient().call();
    //   this.setState({pateintCount});
    //   this.setState({loading: false})
    // }
  }

  onClickHandler = async (e) => {
    e.preventDefault();
    const data = await this.state.Hospital.methods.patients(this.state.adr).call();
    this.setState({data: data});
    console.log(this.state.data);
  }

  displayData(){
    const data = this.state.data;
    if(data)return(
      <div>
        <h3>Name: {data[1]}</h3>
        <h3>Age: {data[5]}</h3>
        <h3>email: {data[3]}</h3>
        <h3>gender: {data[4] === "0" ? 'Male' : 'Female'}</h3>
        <h3>Phone: {data[2]}</h3>
        <h3>Symptoms: {data[6]}</h3>
        
      </div>
    )
    else return(
      <div className="data">
        <Alert showIcon closable type = "warning" message = "Please Enter a valid address to return user's information" />
      </div> 
    )
  }


  render() {
    return (
    <div className="App">
      
      <Navbar feeAccount = {this.state.address} userAccount = {this.state.account}  />
      <div className="section1">
          <h1 className = "mainhead" style = {{fontSize : '90px'}}>se<span style = {{}}>Cure</span></h1>
          <p className = "brandline">Electronic Health Record for Enhanced Privacy, Scalability, and Availability</p>
          <ul>
            <li>Pay the required Amount to the Payment Address, given on the left.</li>
            <li>After the Payment you're eligible for the registration.</li>
          </ul>
      </div>

        <br />
        <br />
        
        {/* //section - 2 */}
        <div className="section2">
        <br />
        <br />

        <h1 className = "header2">User Registration</h1>
          <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
        <Form.Item
          name={['user', 'name']}
          label="Name"
          rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['user', 'email']}
        label="Email"
        rules={[
          {
            type: 'email',
          },
        ]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name={['user', 'age']}
        label="Age"
        rules={[
          {
            type: 'number',
            min: 0,
            max: 99,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      
      <Form.Item name={['user', 'phone']} label="Phone">
        <Input />
      </Form.Item>
      
      <Form.Item name={['user', 'symptoms']} label="Symptoms">
        <Input.TextArea placeholder = "Write Comma (,) seperated values like Cold, Cough, Nausea." />
      </Form.Item>
      
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      
      </Form.Item>
    </Form>
        </div>


        <br />
        <br />
        <br />
      
      {/* //section - 3 */}
      
      <div className="section3">
      <h1>User's Info</h1>
      <br />
      <br />
      <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
        <Form.Item
          name={['user', 'address']}
          label="Name"
          rules={[
          {
            required: true,
          },
        ]}
        onChange = {(e) => {this.setState({adr: e.target.value})}}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        
        <Button type="primary" onClick = {this.onClickHandler}>
          Find!!
        </Button>
      
      </Form.Item>
      </Form>
        {this.displayData()}
      </div>
    </div>
  );
  }
}