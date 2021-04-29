<template>
 <div class="app-container">
      <div class="filter-container">

         <router-link :to="{name:'CreateGoodsType'}">
          <el-button type="primary"  style="margin-left: 10px;"  plain>添加分类</el-button>
          </router-link>

      </div>
      <br>
   <el-table
     :key="tableKey"
    :data="tableData"
    v-loading="listLoading"
     border
     fit
     highlight-current-row
     style="width: 100%;"
   >
     <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" >
       <template slot-scope="{row}">
         <span>{{ row.ID }}</span>
       </template>
     </el-table-column>


     <el-table-column label="分类名称" align="center">
       <template slot-scope="{row}">
         <span>{{ row.Name}}</span>
       </template>
     </el-table-column>

     <el-table-column label="创建时间" align="center">
       <template slot-scope="{row}">
         <span>{{ row.CreatedAt }}</span>
       </template>
     </el-table-column>

     <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
       <template slot-scope="{row,$index}">
         <router-link :to="'edit/'+row.ID">
           <el-button type="primary" size="mini" style="margin-right: 5px;">
             编辑
           </el-button>
         </router-link>

         <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
           删除
         </el-button>
       </template>
     </el-table-column>
   </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
</div>
</template>

<script>
   import {goodsTypeList, delGoodsType} from '@/api/goods_type'
   import waves from '@/directive/waves' // waves directive
   import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
     directives: { waves },
    data() {
      return {
        tableKey: 0,
        tableData:[],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          title: undefined,
        },
        temp: {
          id: undefined,
          name: '',
        },
        dialogPvVisible: false,
        dialogFormVisible: false,
        dialogStatus: '',
        pvData: [],
        textMap: {
          update: '编辑',
          create: 'Create'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        console.log(this.listQuery)
        goodsTypeList(this.listQuery).then(response => {
          this.tableData = response.data.item;
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleUpdate(row) { console.log(row)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },


      handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('此操作将永久删除分类下所有商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delGoodsType(index.ID).then(response => {
          this.$notify({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.tableData.splice(row, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>
