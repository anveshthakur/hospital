import React, { Component } from 'react';
//front-end
import { Form, Input, InputNumber, Button, Alert, Card } from 'antd';
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

    this.state.Hospital.methods.registerUser(
      this.state.account,
      data.name,
      data.phone,
      data.email,
      data.gender === 'Male' ? 1 : 0,
      data.age,
      data.symptoms,
    ).send({from: this.state.account}).on('transactionHash', (Hash) => {
      this.setState({loading: false});
    })
  
  };

  //Detection if browser has metamask installed
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
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    
    const networkId = await web3.eth.net.getId();
    const networkData = Hospital.networks[networkId];
    this.setState({address : networkData.address});


    if(networkData){
      const hospital = new web3.eth.Contract(Hospital.abi, networkData.address);
      this.setState({Hospital: hospital});
      const pateintCount = await hospital.methods.totalPatient().call();
      this.setState({pateintCount});
      this.setState({loading: false})
    }
  }

  onClickHandler = async (e) => {
    e.preventDefault();
    let data = await this.state.Hospital.methods.patients(this.state.adr).call();
    this.setState({data: data});
    console.log(this.state.data);
  }

  displayData(){
    const data = this.state.data;
    if(data)return(
      <div className="site-card-border-less-wrapper">
        <Card title="Results" bordered={false} style={{ width: 300 }}>
          <p>Name: {data[1]}</p>
          <p>Age: {data[5]}</p>
          <p>E-mail: {data[3]}</p>
          <p>Gender: {data[4] === "0" ? 'Male' : 'Female'}</p> 
          <p>Phone: {data[2]}</p> 
          <p>Symptoms: {data[6]}</p>
          <p>Infected: {data[8] ? 'Infected' : 'Not-Infected'  } </p>
        </Card>
    </div>
    )
    else return(
      <div className="data">
        <Alert showIcon closable type = "warning" message = "Please Enter a valid address to return user's Information" />
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
      <Form.Item name={['user', 'gender']} label="Gender">
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
          label="Account Address"
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
          Get Details
        </Button>
      </Form.Item>
      </Form>
        {this.displayData()}
      </div>

    {/* Section - 4 */}
    <div className="section4">
        {/* Filler or maybe the trigger action */}
       </div>
    </div>
  );
  }
}