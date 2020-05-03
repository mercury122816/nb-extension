import React from 'react';
import './Header.css';
import * as resource from '../../resources/resource.json';

export default (props) => {
    
    return (
        <div className='header'>
            <div className='titlebar'>{resource.title}</div>
        </div>
    );
}