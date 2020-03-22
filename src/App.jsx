import React, { Component } from 'react';
import Table from './components/Table.jsx';

import { getRepository, buildLink } from './requests';
import * as base64 from 'base-64';

const filesToExclude = [
    'jpeg',
    'jpg',
    'png',
    'svg',
]

export default class App extends Component {

    state = {
        link: '',
        isSubmitted: false,
        files: []
    }

    onChangeLink = (e) => {
        const inputValue = e.target.value
        this.setState({
            link: inputValue
        })
    }

    onSubmitLink = (event) => {
        event.preventDefault()
        const url = buildLink(this.state.link)
        getRepository(url).then(res => {
            this.createRequest(res)
        })
    }

    createRequest = (res) => {
        return res.data.map(item => {
            const { url } = item
            getRepository(url).then(res => {
                if (!Array.isArray(res.data)) {
                    this.countLines(res.data)
                } else {
                    this.createRequest(res)
                }
            })
        })
    }

    countLines = (data) => {
        const splittedName = data.name.split('.')
        const extension = splittedName[splittedName.length - 1]
        if (!filesToExclude.includes(extension)) {
            const encodedRes = base64.decode(data.content)
            const lines = encodedRes.split('\n')
            const amountEmptyLines = this.countEmptyLines(lines)
            const amountComments = this.countComments(lines)
            const amountLines = lines.length
            const amountCodeLines = amountLines - amountComments - amountEmptyLines
            const newFile = {
                fileName: data.name,
                amountLines,
                amountCodeLines,
                amountEmptyLines,
                amountComments
            }
            this.setState({
                files: [...this.state.files, newFile]
            }, () => {
                if (this.state.isSubmitted) {
                    this.setState({
                        isSubmitted: false
                    }, () => {
                        this.setState({
                            isSubmitted: true
                        })
                    })
                } else {
                    this.setState({
                        isSubmitted: true
                    })
                }
            })
        }
    }
    countEmptyLines = (lines) => {
        const emptyLines = lines.filter(line => !line)
        return emptyLines.length
    }

    countComments = (lines) => {
        let startIndex = 0;
        let counter = lines.reduce((acc, line, index) => {
            if (line.startsWith('//')) acc++
            if (line.includes('/*')) startIndex = -index;
            if (line.includes('*/')) {
                acc += (startIndex + index + 1)
            }
            return acc
        }, 0)
        return counter
    }

    render() {
        const { link, isSubmitted, files } = this.state
        return (
            <div className="wrapper">
                <form className='form' onSubmit={this.onSubmitLink}>
                    <input type="text"
                        className='users_link'
                        name='link'
                        placeholder="Enter a repo's link"
                        onChange={this.onChangeLink}
                        value={link} />
                    <input type="submit" className='users_link_submit' value="SUBMIT" />

                </form>
                {isSubmitted && <Table usersLink={link} files={files} />}
            </div>
        )
    }
}
