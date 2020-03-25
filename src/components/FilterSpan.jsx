import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';

@inject('store')
@observer
class FilterSpan extends Component {
    
    mainStore = this.props.store
    
    @action.bound
    onChangeFilterData(event) {
        const value = event.target.value
        const { filterData } = this.mainStore
        filterData(value)
    }

    render() {
        const { filterName } = this.mainStore
        return (
            <div className='filter__container'>
                <input
                    placeholder="Enter a file's name"
                    className='filter'
                    defaultValue={filterName}
                    onChange={this.onChangeFilterData}
                />
            </div>
        )
    }
}
export default FilterSpan
