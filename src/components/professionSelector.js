import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* Action creators*/
import { selectProfession } from '../redux/actions'

const ProfessionSelector = (props) => {
    if(props.professions) {
        return (
            <div className='profession-selector'>
                <ul className='desktop-professions'>
                    {props.professions.map((profession, index) => (
                        <li 
                            key={index}
                            className={props.selectedProfession === profession ? 'profession selected-profession' : 'profession'}
                            onClick={() => props.selectProfession(profession)}
                            >
                            {profession}
                        </li>
                    ))}
                </ul>
                <select 
                    className='mobile-professions' 
                    onChange={(event) => props.selectProfession(event.target.value)}
                    >
                    {props.professions.map((profession, index) => (
                        <option
                            value={profession}
                            key={index}
                            className={props.selectedProfession === profession ? 'profession selected-profession' : 'profession'}
                            >
                            {profession.replace(/\w/, letter => letter.toUpperCase())}    
                        </option>
                    ))}
                </select>
            </div>
        )
    } else {
        return (
            <div className='professions-skeleton'>profession selection skeleton</div>
        )
    }
}


const mapStateToProps = (state) => ({
    professions: state.professions,
    selectedProfession: state.selectedProfession
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ selectProfession }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionSelector)