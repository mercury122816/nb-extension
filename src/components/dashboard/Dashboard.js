import React, { useState, useEffect } from 'react';
import 'react-virtualized/styles.css';
import ls from 'local-storage';
import List from 'react-virtualized/dist/commonjs/List';
import { uuid } from 'uuidv4';
import add from './add-note.png';
import deleteIcon from './delete.png';
import editIcon from './edit.png';
import './Dashboard.css';

export default (props) => {

    const [list, setList] = useState([]);

    useEffect(() => {
        const nbListStr = ls.get('note_list');
        if (nbListStr) {
            setList(JSON.parse(nbListStr));
        }
    }, []);

    const addNote = () => {
        let newList = [];
        const id = uuid();
        const nbListStr = ls.get('note_list');
        if (nbListStr) {
            newList = JSON.parse(nbListStr);
        }
        const newNote = {
            id,
            title: 'New Note'
        };
        newList.push(newNote);
        newList = newList.reverse();
        ls.set('note_list', JSON.stringify(newList));
        setList(newList);
    }

    const updateTitle = (id, title) => {
        const newList = list.map(item => {
            if(item.id === id) {
                item.title = title;
            }
            return item;
        });
        ls.set('note_list', JSON.stringify(newList));
        setList(newList);
    }
    const EditableText = (props) => {
        const [edit, setEdit] = useState(false);
        const [value, setValue] = useState('');

        useEffect(()=>{
            setValue(props.title);
        }, [props.title]);

        const onChange = (e) => {
            setValue(e.target.value);
        }

        const update = () => {
            setEdit(false);
            props.updateTitle(props.id, value);
        }

        const makeEdit = () => {
            setEdit(true);
        }

        if(edit) {
            return (
                <div className='title'>
                    <input type='text' value={value} onChange={onChange} onBlur={update} />
                </div>
            );
        }
        else {
            return (
                <div className='title' onClick={makeEdit}>
                    {props.title}
                </div>
            )
        }
    }

    const rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        const title = list[index].title;
        const ic = title[0].toUpperCase();
        let partialText = ls.get(list[index].id) || 'Empty Note....';
        partialText = partialText.substring(0, 30);
        const backColor = getRandomColor();
        const icStyle = {
            backgroundColor: backColor
        };
        const onRowClick = () => {
            ls.set('active_nb', list[index].id);
            props.setSelectedTab(0);
        }
        const deleteNote = () => {
            const newList = list.filter(item => item.id !== list[index].id);
            const currentActive = ls.get('active_nb');
            const activeId = currentActive === list[index].id ? newList[0].id : currentActive;
            ls.set('active_nb', activeId);
            ls.set('note_list', JSON.stringify(newList));
            ls.remove(newList[0].id);
            setList(newList);
        }
        return (
            <div key={key} className='note-container'
                style={style}>
                <div className='note'>
                    <div style={icStyle} className='ic'>{ic}</div>
                    <div className='text'>
                        <EditableText id={list[index].id}
                            title={title}
                            updateTitle={updateTitle}
                        />
                        <div className='msg'>{partialText}</div>
                    </div>
                </div>
                <div>
                    <img src={editIcon} width={24} height={24}
                        className='edit' 
                        onClick={onRowClick} alt="" />
                    <img src={deleteIcon} width={24} height={24}
                        className='delete' 
                        onClick={deleteNote} alt="" />
                </div>
            </div>
        );
    }

    return (
        <div className='dashboard'>
            <div className='tools'>
                <img src={add} width={48} height={24} onClick={addNote} alt="" />
            </div>
            <div className='note-list'>
                <List
                    width={window.screen.width * 0.4}
                    height={window.screen.height * 0.5}
                    rowCount={list.length}
                    rowHeight={60}
                    rowRenderer={rowRenderer}
                />
            </div>
        </div>
    );
}

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}