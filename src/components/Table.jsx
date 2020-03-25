import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';


@inject('store') @observer
class Table extends Component {
    mainStore = this.props.store       
        
    @action    
    onClickSortData(prop) {
        const { sortData } = this.mainStore
        sortData(prop)
    }

    render() {        
        const { renderFiles } = this.mainStore        
        return (
            <table className="table" border="1">
                <tbody>
                    <tr className='titles'>
                        <th className="table__file_name title" onClick={() => this.onClickSortData('fileName')}>Имя файла</th>
                        <th className="table__row_amount title" onClick={() => this.onClickSortData('amountLines')}>Всего строк</th>
                        <th className="table__code title" onClick={() => this.onClickSortData('amountCodeLines')}>Код</th>
                        <th className="table__comment title" onClick={() => this.onClickSortData('amountComments')}>Комментарии</th>
                        <th className="table__empty title" onClick={() => this.onClickSortData('amountEmptyLines')}>Пустые</th>
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

export default Table