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

    <!-- 工具条 -->
    <div>
        <router-link :to="'/hosp/hospitalSet/add'">
          <el-button type="primary" size="mini">添加</el-button>
        </router-link>

        <el-button type="danger" size="mini" @click="removeRows()">批量删除</el-button> <!-- 批量删除 -->
    </div>

    <!-- banner列表 -->
    <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
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

      <!-- 最右侧操作栏 -->
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
            <!--编辑按钮-->
            <router-link :to="'/hosp/hospitalSet/edit/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button> 
            </router-link>
            <!-- 锁定和取消锁定 -->
            <el-button v-if="scope.row.status==1" type="warning" size="mini" 
                icon="el-icon-lock" @click="lockHostSet(scope.row.id,0)"></el-button>
            <el-button v-if="scope.row.status==0" type="success" size="mini" 
                icon="el-icon-unlock" @click="lockHostSet(scope.row.id,1)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" 
                icon="el-icon-delete" @click="removeDataByRow(scope.row)"> 
            </el-button>
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
import hospitalSetApi from "@/api/hospitalSet"; //即前面定义的那个api下的js

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
      limit: 5, //每页显示记录数
      searchObj: { hosname: "", hoscode: "" }, //条件封装对象
      list: [], //每页数据集合，这个是用来接受返回的列表的
      total: 0, //总记录数
      multipleSelection: [], //批量选择中选择的记录列表
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

    //删除医院设置的方法 - 通过id
    removeDataById(id) {
        this.$confirm(`此操作将永久删除医院的设置信息，是否继续？`,'提示',{
     	   confirmButtonText:'确认',
     	   cancelButtonText:'取消',
     	   type:'warning'
     	}).then(()=>{  //确定执行then方法
     		//调用删除接口
     		hospitalSetApi.deleteHospSet(id)
     		.then(response=>{
     			this.$message({
     				type:'success',
     				message:'删除成功！'
     			})
     		    //刷新页面
     			this.getList(1)
     		})         
     	})
    },

    //新的删除医院设置的方法 - 直接拿到整个行，这样可以配合hosname做友好提示
    removeDataByRow(row) {
        this.$confirm(`此操作将永久删除「${row.hosname}」的设置信息，是否继续？`,'提示',{
     	   confirmButtonText:'确定',
     	   cancelButtonText:'取消',
     	   type:'warning'
     	}).then(()=>{  //确定执行then方法
     		//调用删除接口
     		hospitalSetApi.deleteHospSet(row.id)
     		.then(response=>{
     			this.$message({
     				type:'success',
     				message:'删除成功！'
     			})
     		    //刷新页面
     			this.getList(1)
     		})         
     	})
    },

    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
        this.multipleSelection = selection
    },

    //批量删除
    removeRows() {
        this.$confirm('此操作将永久删除选中医院的设置信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { //确定执行then方法
            var idList = []
            //遍历数组得到每个id值，设置到idList里面
            for(var i=0;i<this.multipleSelection.length;i++) {
                var obj = this.multipleSelection[i]
                var id = obj.id
                idList.push(id)
            }
            //调用接口
            hospitalSetApi.removeRows(idList)
                .then(response => {
                    //提示
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    //刷新页面
                    this.getList(1)
                })
        })
    },

    //锁定与解锁 
    lockHostSet(id,status) {
        hospitalSetApi.lockHospSet(id,status)
        .then(response => {
            //刷新
            this.getList(this.current)
        })
    }


  },
};
</script>