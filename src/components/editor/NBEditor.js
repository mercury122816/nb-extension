import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from "jodit-react";
import ls from 'local-storage';
import { uuid } from 'uuidv4';
import download from './download.png';
import './NBEditor.css';

export default () => {

    const editor = useRef(null);
    const activeNb = useRef(null);
    const activeContent = useRef('');

    const [content, setContent] = useState('');

    const currentSelection = ls.get('current_selection');

    useEffect(() => {
        activeNb.current = ls.get('active_nb');
        if (!activeNb.current) {
            updateNoteList();
        }
        activeContent.current = ls.get(activeNb.current);
    }, []);

    useEffect(() => {
        if (!activeContent.current || activeContent.current.length === 0) {
            activeContent.current = currentSelection || '';
        }
        else {
            activeContent.current = activeContent.current + '<br>' + currentSelection;
        }
        updateContent();
        resetCurrentSelection();
    }, [currentSelection]);

    const updateNoteList = () => {
        const id = uuid();
        ls.set('active_nb', id);
        activeNb.current = id;
        const newNote = {
            id,
            title: 'New Note'
        };
        let noteList = ls.get('note_list') || [];
        noteList.push(newNote);
        ls.set('note_list', JSON.stringify(noteList));
    }

    const updateContent = () => {
        ls.set(activeNb.current, activeContent.current);
        setContent(activeContent.current);
    }

    const resetCurrentSelection = () => {
        ls.set('current_selection', '');
    }

    const onChange = (newValue) => {
        activeContent.current = newValue;
        ls.set(activeNb.current, newValue);
        setContent(newValue);
    }

    const config = {
        readonly: false
    }

    const NBHeader = () => {
        let title = 'New Note';
        const notes = ls.get('note_list');
        let noteList = notes?JSON.parse(notes):[];
        const filteredNote = noteList.filter(item => item.id === activeNb.current);
        if(filteredNote && filteredNote.length > 0) {
            title = filteredNote[0].title;
        }
        const onClick = () => {
            const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
            const postHtml = "</body></html>";
            const content = ls.get(activeNb.current) || '';
            const html = preHtml+content+postHtml;
            const blob = new Blob(['\ufeff', html], {
                type: 'application/msword'
            });
            const element = document.createElement("a");
            element.href = URL.createObjectURL(blob);
            element.download = `${title}.doc`;
            document.body.appendChild(element);
            element.click();
        }
        return (
            <div className='nb-header'>
                <div className='nb'>
                    <label>{title}</label>
                    <img width={20} height={20} title="Download" 
                        onClick={onClick}
                        src={download} />
                </div>
            </div>
        );
    }

    const getWidth = () => {
        if(window.screen.width < 1024) {
            return window.screen.width * 0.8;
        }
        return window.screen.width * 0.4;
    }

    return (
        <div className='nb-editor' style={{ width: getWidth() }}>
            <NBHeader />
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={onChange}
                onChange={(newContent => {})}
            />
        </div>
    );
}