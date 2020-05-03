import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from "jodit-react";
import ls from 'local-storage';
import { uuid } from 'uuidv4';

export default () => {

    const editor = useRef(null);
    const activeNb = useRef(null);
    const activeContent = useRef(null);

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
        if (!activeContent.current) {
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

    return (
        <div className='nb-editor' style={{ width: window.screen.width * 0.4 }}>
            <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={newContent => setContent(newContent)}
                onChange={onChange}
            />
        </div>
    );
}