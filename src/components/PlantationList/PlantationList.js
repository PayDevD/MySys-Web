import React from 'react';
import { Link } from 'react-router-dom';
import './PlantationList.css';

const PlantationList = ({ plantations, web3, accounts }) => {
    if(plantations == null) {
        return (
            <React.Fragment></React.Fragment>
        )
    } else {
        return plantations.map((plantation, index) => {
            return <React.Fragment>
                <div key={index}>
                    <p>위치: 위도 {plantation.position.lat} 경도 {plantation.position.lng}</p>
                    <p>재배지 이름 : {plantation.title}</p>
                    <Link to={ {pathname:'record', plantation_id: plantation.id, web3: web3, accounts: accounts} } >일지 보기</Link>
                </div>
            </React.Fragment>
        })
    }
}

export default PlantationList;