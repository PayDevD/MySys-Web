import React from 'react';
import axios from 'axios';
import SHA512 from 'crypto-js/sha512';
import RecordModal from './components/RecordModal';
import SanyangsamContract from './contract/Sanyangsam.json';

class Record extends React.Component {
    state = {
        web3: null,
        accounts: [],
        contract: null,
        plantation_id: null,
        records: [],
        isModalOpen: false,
        type: 'growing',
        content: ''
    };

    listStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '800px',
        height: '800px',
        marginLeft: '-400px',
        marginTop: '-400px',
        border: '1px solid gray',
        textAlign: 'center'
        
    }

    componentDidMount = async () => {
        await this.setState({
            web3: this.props.location.web3,
            accounts: this.props.location.accounts,
            plantation_id: this.props.location.plantation_id
        });

        const networkId = await this.state.web3.eth.net.getId();
        const deployedNetwork = SanyangsamContract.networks[networkId];
        const instance = new this.state.web3.eth.Contract(
            SanyangsamContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        await this.getRecords();
        this.setState({ contract: instance });
    }

    getRecords = async () => {
        await axios.get('http://localhost:4000/api/records/'+ this.props.location.plantation_id)
        .then((res) => {
            if(typeof res.data.result === 'undefined') {
                this.setState({
                    records: res.data
                })
            }
        });
    }

    getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = date.getMilliseconds();
        return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
    }

    renderRecords = () => {
        if(this.state.records.length !== 0) {
            return this.state.records.map((record, index) => {
                return (
                    <div key={index} id={index} className='record'>
                        <p>날짜 : {record.date.substring(0, 10)}</p>
                        <p>단계 : {record.type}</p>
                        <p>작업 내용 : {record.content}</p>
                        <button onClick={() => this.validate(index)}>유효성 검증</button>
                    </div>
                )
            })
        } else {
            return (
                <p>등록된 일지가 없습니다.</p>
            )
        }
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    }

    closeModal = () => {
        this.setState({ isModalOpen : false, type: 'growing', content: '' });
    }

    handleType = (e) => {
        this.setState({ type: e.target.value });
    }
    
    handleContent = (e) => {
        this.setState({ content: e.target.value });
    }

    registerRecord = async () => {
        const { accounts, contract, plantation_id, type, content } = this.state;
        if(await contract.methods.getOwners(plantation_id).call() !== accounts[0]) {
            await contract.methods.addOwners(plantation_id).send({ from:accounts[0] });
        }

        const data = {
            plantation_id: plantation_id,
            date: this.getCurrentDate(),
            type: type,
            content: content
        };

        const jsonString = JSON.stringify(data);
        const hashValue = SHA512(jsonString).toString();
        await contract.methods.addHashValue(hashValue, plantation_id).send({ from:accounts[0] })
        .on('transactionHash', async (hash) => {
            data.txHash = hash;
            await axios.post('http://localhost:4000/api/addrecord', data);
            await this.getRecords();
        })
        
        this.closeModal();
    }

    validate = (index) => {
        const { web3, records } = this.state;
        web3.eth.getTransaction(records[index].txHash, (err, tx) => {
            if(tx != null) alert("유효한 기록입니다.");
            else alert("유효하지 않은 기록입니다.");
        })
    }

    render() {
        return (
            <div style={this.listStyle}>   
                {this.renderRecords()}             
                <button onClick={this.openModal}>일지 작성</button>
                <RecordModal isOpen={this.state.isModalOpen} close={this.closeModal} 
                type={this.state.type} handleType={this.handleType}
                content={this.state.content} handleContent={this.handleContent}
                register={this.registerRecord}
                />
            </div>      
        )
    }
}

export default Record;