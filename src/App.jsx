import React, { Component } from 'react';
import Table from './components/Table.jsx';
import FilterSpan from './components/FilterSpan';

import { buildLink } from './requests';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';

@inject('store')
@observer
class App extends Component {
    mainStore = this.props.store

    @action.bound
    onChangeLink(e) {
        const inputValue = e.target.value
        const { changeLink } = this.mainStore
        changeLink(inputValue)
    }

    @action.bound
    onSubmitLink(event) {
        event.preventDefault()
        const { getRepo, link } = this.mainStore
        const url = buildLink(link)
        getRepo(url)
    }    

    render() {
        const { link, files } = this.mainStore
        
        return (
            <div className="wrapper">
                <form className='form' onSubmit={this.onSubmitLink}>
                    <input type="text"
                        className='users_link'
                        name='link'
                        placeholder="Enter a repo's link"
                        onChange={this.onChangeLink}
                        defaultValue={link} />
                    <input type="submit" className='users_link_submit' defaultValue="SUBMIT" />
                </form>
                <FilterSpan />
                {!!files.length && <Table usersLink={link} />}
            </div>
        )
    }
}

export default App