import { observable, action, toJS } from 'mobx';
import { getRepository, auth } from '../requests';
import * as base64 from 'base-64';

const filesToExclude = [
    'jpeg',
    'jpg',
    'png',
    'svg',
]

class MainStore {
    @observable
    link = ''

    @observable
    files = []

    @observable
    renderFiles = []

    @observable
    sortField = ''

    @observable
    filterName = ''

    @action.bound
    getRepo(url) {
        this.files = [];
        getRepository(url).then(res => {
            this.createRequest(res)
        })
    }

    @action.bound
    changeLink(newLink) {
        this.link = newLink
    }

    @action.bound
    createRequest(res) {
        return res.data.map(item => {
            const { url } = item
            getRepository(`${url}&${auth}`).then(res => {
                if (!Array.isArray(res.data)) {
                    this.countLines(res.data)
                } else {
                    this.createRequest(res)
                }
            })
        })
    }

    @action.bound
    countLines(data) {        
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
            this.files = [...this.files, newFile]
            this.renderFiles.replace(this.files)
        }
    }

    @action.bound
    countEmptyLines(lines) {
        const emptyLines = lines.filter(line => !line)
        return emptyLines.length
    }

    @action.bound
    countComments(lines) {
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

    @action.bound
    sortData(prop) {
        const sortedFiles = [...this.renderFiles].sort((a, b) => {
            if (a[prop] > b[prop]) {
                return 1
            }
            if (a[prop] < b[prop]) {
                return -1
            }
        })

        if (this.sortField !== prop) {
            this.renderFiles.replace(sortedFiles)
            this.sortField = prop
        } else {
            const reversedFiles = sortedFiles.reverse()
            this.renderFiles.replace(reversedFiles)
            this.sortField = ''
        }
    }

    @action.bound
    filterData(value){
        this.filterName = value        
        if (this.filterName) {
            const filteredData = this.files.filter(file => {
                return file.fileName.toLowerCase().includes(this.filterName)
            })            
            this.renderFiles.replace(filteredData)
        } else {
            this.renderFiles.replace(this.files)
        }
    }
}
export default MainStore