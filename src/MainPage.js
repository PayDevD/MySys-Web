import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import { Link } from "react-router-dom";
import './MainPage.css';

class MainPage extends Component {
  state = { web3: null, accounts: null };

  topBarStyle = {
    width: '790px',
    marginTop: '0',
    padding: '12px 5px',
    backgroundColor: '#49c8a2',
    fontSize: '13pt',
    color: 'white',
    border: '1px solid #white',
  };

  buttonStyle = {
    textDecoration: 'none',
    color: 'black',
    fontSize: '25px',
    letterSpacing: '4px',
    border: '1px solid gray',
    padding: '12px 7px',
    position: 'absolute',
    top: '30%',
    left: '37%'
  };

  componentDidMount = async () => {
    await this.walletConnect();
  };

  walletConnect = async (e) => {
    console.log("connect...")
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log("success to get web3");
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("success to get account");
      // Get the contract instance.

      console.log(accounts);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  render() {

    if(this.state.accounts == null) {
        return (
            <div className="Main">
                <p>메타마스크에 연결할 수 없습니다. 다시 한 번 확인해주세요</p>
            </div>
        )
    }
    else {
        return (
            <div className="Main">
                <p style={this.topBarStyle}>{this.state.accounts[0]}님, 어서오세요</p>
                <Link to={ {pathname:'list', web3:this.state.web3, accounts:this.state.accounts} } style={this.buttonStyle}>내 재배지 보기</Link>
            </div>
          );
    }
  }
}

export default MainPage;
