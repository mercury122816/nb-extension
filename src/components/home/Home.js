import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as resource from '../../resources/resource.json';
import Header from '../header/Header';
import NBEditor from '../editor/NBEditor';
import DashBoard from '../dashboard/Dashboard';
import './Home.css';

export default () => {

    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div className='base'>
            <Header />
            <Tabs selectedIndex={selectedTab} onSelect={tabIndex => setSelectedTab(tabIndex)}>
                <TabList>
                    <Tab>{resource.editor}</Tab>
                    <Tab>{resource.manager}</Tab>
                </TabList>
                <TabPanel>
                    <NBEditor />
                </TabPanel>
                <TabPanel>
                    <DashBoard setSelectedTab={setSelectedTab}/>
                </TabPanel>
            </Tabs>
        </div>
    );
}