<template>
<div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
        <el-select
            v-model="searchObj.provinceCode"
            placeholder="请选择省"
            @change="provinceChanged">
            <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
    </el-form-item>

    <el-form-item>
        <el-select
        v-model="searchObj.cityCode"
        placeholder="请选择市"
        @change="cityChanged">
            <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
    </el-form-item>

    <el-form-item>
        <el-select
        v-model="searchObj.districtCode"
        placeholder="请选择区"
        @change="$forceUpdate()">
            <el-option
            v-for="item in districtList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
    </el-form-item>

    <el-form-item>
        <el-input v-model="searchObj.hosname" placeholder="医院名称"/>
    </el-form-item>

    <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
    <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

<!-- banner列表 -->
<el-table v-loading="listLoading" :data="list"
        border
      fit
      highlight-current-row>

    <el-table-column
    label="序号"
    width="60"
    align="center">
        <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
    </el-table-column>

    <el-table-column label="医院 logo">
        <template slot-scope="scope">
        <img :src="'data:image/jpeg;base64,'+scope.row.logoData" width="80">
        </template>
    </el-table-column>

    <el-table-column prop="hosname" label="医院名称"/>
    <el-table-column prop="param.hostypeString" label="等级" width="90"/>
    <el-table-column prop="param.fullAddress" label="详情地址"/>
    <el-table-column label="状态" width="80">
        <template slot-scope="scope">
                {{ scope.row.status === 0 ? '未上线' : '已上线' }}
        </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间"/>

    <el-table-column label="操作" width="230" align="center">
    <template slot-scope="scope">
        <el-button v-if="scope.row.status == 1"  type="danger" size="mini" @click="updateStatus(scope.row.id, 0)">下线</el-button>
        <el-button v-if="scope.row.status == 0"  type="primary" size="mini" @click="updateStatus(scope.row.id, 1)">上线</el-button>
    <router-link :to="'/hosp/hospital/show/'+scope.row.id">
       <el-button type="primary" size="mini">查看</el-button>
    </router-link>
   <router-link :to="'/hosp/hospital/schedule/'+scope.row.hoscode">
    <el-button type="primary" size="mini">排班</el-button>
   </router-link> 
    </template>
    </el-table-column>
    
</el-table>

    <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        style="padding: 30px 0; text-align: center;"
        layout="sizes, prev, pager, next, jumper, ->, total, slot"
        @current-change="fetchData"
        @size-change="changeSize"
    />
</div>
</template>

<script>
import hospitalApi from '@/api/hosp'
export default {
    // 定义变量初始值
    data() {
        return {
            listLoading: true, // 数据是否正在加载
            list: null, // banner列表(医院数据集合)
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 10, // 每页记录数
            searchObj: {}, // 查询表单对象
            provinceList: [], // 所有省集合
            cityList: [], // 所有市集合
            districtList: [] // 所有地区集合
        }
    },

    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
        console.log('list created......')
        this.fetchData() //默认先展示第一页医院列表

        // 先将所有省查询出来
        hospitalApi.findByDictCode('Province').then(response => {
            this.provinceList = response.data
        })
    },

    methods: {
		updateStatus(id, status) {
		   hospitalApi.updateStatus(id, status)
		    .then(response => {
            this.fetchData(this.page)
		      })
		 },
        // 加载banner列表数据(展示医院列表)
        fetchData(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            this.page = page
            hospitalApi.getPageList(this.page, this.limit, this.searchObj).then(
                response => {
                    // 每页数据集合
                    this.list = response.data.content
                    // 总记录数
                    this.total = response.data.totalElements

                    // 加载图表不显示
                    this.listLoading = false
                }
            )
        },

        // 当页码发生改变的时候，修改每页的记录数
        changeSize(size) {
            console.log(size)
            this.limit = size
            this.fetchData(1)
        },

        // 重置查询表单
        resetData() {
            console.log('重置查询表单')
            this.searchObj = {}
            this.fetchData()
        },
        
        // 点击某个省，显示里面市，省市联动
        provinceChanged() {
            this.cityList = []
            this.searchObj.cityCode = null
            this.districtList = []
            this.searchObj.districtCode = null
            // 根据父id(省)查询其下级数据字典列表(市)
            hospitalApi.findByParentId(this.searchObj.provinceCode).then(response => {
                this.cityList = response.data
            })
        },

        // 点击某个市，显示里面区，市区联动
        cityChanged() {
            this.districtList = []
            this.searchObj.districtCode = null
            // 根据父id(市)查询其下级数据字典列表(区)
            hospitalApi.findByParentId(this.searchObj.cityCode).then(response => {
                this.districtList = response.data
            })
        },

        // 更新医院上线状态
        updateStatus(id, status) {
		   hospitalApi.updateStatus(id, status)
		    .then(response => {
                // 刷新页面
                this.fetchData(this.page)
		    })
		 },
    }
}
</script>