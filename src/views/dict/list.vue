<template>
    <div class="app-container">
        <div class="el-toolbar">
            <div class="el-toolbar-body" style="justify-content: flex-start;">
                <el-button type="primary" size="mini" @click="exportData"><i class="fa fa-plus"/>导出</el-button>
                <el-button type="primary" size="mini" @click="importData"><i class="fa fa-plus"/>导入</el-button>
            </div>
        </div>
        <br/> <!--换行-->

        <el-table
        :data="list"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :load="getChildrens"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column label="名称" width="230" align="left">
            <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            </template>
            </el-table-column>

            <el-table-column label="编码" width="220">
            <template slot-scope="{row}">
                {{ row.dictCode }}
            </template>
            </el-table-column>
            <el-table-column label="值" width="230" align="left">
            <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
            </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
            </template>
            </el-table-column>
        </el-table>

        <!-- 导入按钮弹出层 -->
        <el-dialog title="导入" :visible.sync="dialogImportVisible" width="480px">
            <el-form label-position="right" label-width="170px">
                <el-form-item label="文件">
                    <el-upload
                    :multiple="false"
                    :on-success="onUploadSuccess"
                    :action="'http://localhost:8202/admin/cmn/dict/importData'"
                    class="upload-demo">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传 xls 文件，且不超过500KB</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImportVisible = false">
                    取消
                </el-button>
            </div>
        </el-dialog>

    </div>

</template>
<script>
import dictApi from '@/api/dict'

export default {
    data() {
        return {
            list:[], // 数据字典列表数组
            dialogImportVisible:false // 设置导入弹框是否弹出
        }
    },

    created() {
        this.getDictList(1)
    },

    methods: {
        // 数据字典列表
        getDictList(id) {
            dictApi.dictList(id).then(response => {
                this.list = response.data
            })
        },
        getChildrens(tree, treeNode, resolve) { //递归进行层级显示
            dictApi.dictList(tree.id).then(response => {
                resolve(response.data)
            })
        },

        // 导出数据字典
        exportData() {
            // 直接调用后端提供的导出接口
            window.location.href = 'http://localhost:8202/admin/cmn/dict/exportData'
        },

        // 上传导入数据字典
        importData() {
            this.dialogImportVisible = true
        },

        // 上传成功调用
        onUploadSuccess(response, file) {
            this.$message.info('上传成功')
            this.dialogImportVisible = false // 关闭弹框
            //刷新页面
			this.getDictList(1)
        }

    }
}
</script>   