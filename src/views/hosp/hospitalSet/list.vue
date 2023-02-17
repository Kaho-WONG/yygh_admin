<template>
  <div class="app-container">
    <!-- 表单查询 -->
    <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
        <el-input  v-model="searchObj.hosname" placeholder="医院名称"/>
    </el-form-item>
    <el-form-item>
        <el-input v-model="searchObj.hoscode" placeholder="医院编号"/>
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>

    <!-- banner列表 -->
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column type="index" width="50" label="序号"/>
      <el-table-column prop="hosname" label="医院名称" />
      <el-table-column prop="hoscode" label="医院编号" />
      <el-table-column prop="apiUrl" label="api基础路径" width="200" />
      <el-table-column prop="contactsName" label="联系人姓名" />
      <el-table-column prop="contactsPhone" label="联系人手机" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "可用" : "不可用" }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 (分页导航条)-->
    <el-pagination
        :current-page="current"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
    />

  </div>
</template>


<script>
//引入接口定义的js文件
import hospitalSetApi from "@/api/hosp/hospitalSet"; //即前面定义的那个api下的js

export default {
  /*
下面的代码是有结构的 
    data(){ return{};},
    created(){},
    methods:{}
*/
  //定义变量和初始值
  data() {
    return {
      //(page, limit, searchObj)参考这里传递的参数进行定义变量
      current: 1, //当前页
      limit: 3, //每页显示记录数
      searchObj: { hosname: "", hoscode: "" }, //条件封装对象
      list: [], //每页数据集合，这个是用来接受返回的列表的
      total: 0,
      multipleSelection: [],
    };
  },

  //页面渲染之前执行：一般用来调用methods定义的方法，得到数据
  created() {
    //只能调用当前vue的方法，不能直接调用到 hospitalSetApi.getPageList的
    this.getList();
  },

  //定义方法，进行请求接口调用
  methods: {
    //分页获取医院设置列表
    getList(page = 1) { //不传默认第1页
      //前面已经 import hospitalSetApi from '@/api/hosp/hospitalSet'

      this.current = page;

      //使用hospitalSetApi调用方法即可  ,  这个方法是暴露出来的
      hospitalSetApi
        .getPageList(this.current, this.limit, this.searchObj)
        .then((response) => {
          console.log(response);
          this.list = response.data.records;
          this.total = response.data.total;
        }) //请求成功
        .catch((error) => {
          console.log(error);
        }); //请求失败
    },
  },
};
</script>