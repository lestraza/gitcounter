import React, { Component } from 'react';


export default class Table extends Component {

    state = {
        renderFiles: [...this.props.files],
        sortField: '',
        filterName: ''    
    }
        
    sortData = (prop) => {         
        const { renderFiles, sortField } = this.state     
        const sortedFiles = renderFiles.sort((a, b) => {
            if(a[prop] > b[prop]) {
                return 1
            }
            if(a[prop] < b[prop]) {
                return -1
            }    
        })
        if(sortField !== prop) {
            this.setState({
                renderFiles: [...sortedFiles],
                sortField: prop
            })
        } else {
            const reversedFiles = sortedFiles.reverse()
            this.setState({
                renderFiles: [...reversedFiles],
                sortField: ''
            })
        }
    }

    filterData = (event) => {
        this.setState({
            filterName: event.target.value
        }, () => {
            if(this.state.filterName) {
                const filteredData = this.props.files.filter( file => {
                return file.fileName.includes(this.state.filterName)
            })
            this.setState({
                renderFiles: [...filteredData]
            })
            } else {
                this.setState({
                    renderFiles: [...this.props.files]
                })
            }  
        }) 
    }

    render() {
        const { renderFiles, filterName } = this.state
        return (
            <table className="table" border="1">
                <tbody>
                    <tr className='titles'>
                        <th className="table__file_name title" onClick={() => this.sortData('fileName')}>Имя файла</th>
                        <th className="table__row_amount title" onClick={() => this.sortData('amountLines')}>Всего строк</th>
                        <th className="table__code title" onClick={() => this.sortData('amountCodeLines')}>Код</th>
                        <th className="table__comment title" onClick={() => this.sortData('amountComments')}>Комментарии</th>
                        <th className="table__empty title" onClick={() => this.sortData('amountEmptyLines')}>Пустые</th>
                    </tr>
                    <tr className='filters_container'>
                        <th className="table__file_name title" onChange={this.filterData}>
                            <input placeholder="Enter a file's name" className='filter' defaultValue={filterName}/>
                            </th>
                        <th className="table__row_amount title" ></th>
                        <th className="table__code title" ></th>
                        <th className="table__comment title" ></th>
                        <th className="table__empty title" ></th>
                    </tr>

                    {renderFiles.length > 0 && (
                        renderFiles.map((file, key) => {
                            return (
                                <tr key={key}>
                                    <td className='table__column__file_name content'>{file.fileName}</td>
                                    <td className='table__column__row_amount content'>{file.amountLines}</td>
                                    <td className='table__column__code content'>{file.amountCodeLines}</td>
                                    <td className='table__column__comment content'>{file.amountComments}</td>
                                    <td className='table__column__empty content'>{file.amountEmptyLines}</td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        )
    }
}