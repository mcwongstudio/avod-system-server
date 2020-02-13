const fs = require('fs');
const path = require('path')
const Course = require('../models/Course');

const publicPath = path.join(__dirname, '../public')

const dropUselessCourse = async()=> {
    try {
        const findResult = await Course.find({'usable': false})
        if(findResult && findResult.length > 0) {
            for(let i in findResult) {
                const content =  findResult[i].content
                const image = findResult[i].image
                if(image) {
                    const imagepath = path.join(publicPath, image)
                    // 删除图片操作
                    await fs.unlink(imagepath, err => {
                        if(err) {console.log(err)}
                    })
                }
                
                for(let j in content) {
                    const video = content[j].url
                    if(video) {
                        const videopath = path.join(publicPath, video)
                        // 删除视频操作
                        await fs.unlink(videopath, err => {
                            if(err) {console.log(err)}
                        })
                    }
                }
            }
        }

        // 数据库中删除数据
        await Course.remove(
            {'usable': false}, //查找条件
        ).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    } catch(e) {
        console.log(e)
        return('删除失败')
    }
}

module.exports = dropUselessCourse