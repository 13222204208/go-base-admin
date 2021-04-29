<template>
 <div class="app-container">
<el-form ref="form" :model="form" :rules="rules" label-width="80px">
  <el-form-item label="分类名称" prop="name">
    <el-input v-model="form.name" style="width: 58rem;"></el-input>
  </el-form-item>



  <el-form-item>
    <el-button type="primary" @click="onSubmit">更新保存</el-button>
<!--     <el-button>取消</el-button> -->
  </el-form-item>
</el-form>
    <!-- 编辑器 -->

  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import { editGoodsType, updateGoodsType } from '@/api/goods_type'
export default {
  data() {
    const validateTitle = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入标题'))
      } else {
        callback()
      }
    }


    return {
      editor:null,//编辑器实例
      form:{
        id:'',
        name:'',
      },
        rules: {
          name: [
            { required:true,validator: validateTitle, trigger: 'blur' },
            { min: 2, max: 60, message: '长度在 2 到 60个字符', trigger: 'blur' }
          ],

        },
      option:[],
      imgFilesList:[],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl:process.env.VUE_APP_BASE_API+"/upload/img"
    }
  },

  created() {

    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },

  methods: {
    fetchData(id) {
      editGoodsType(id).then(response => {
        console.log(response)
        this.form.id= response.data.ID;
        this.form.name= response.data.Name;
      }).catch(err => {
        console.log(err)
      })
    },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleUpSuccess(response){
          if(response.uploaded == true){
            this.form.cover = response.url;
            console.log(this.form.cover);
          }
      },

    onSubmit(){
      updateGoodsType(this.form.id,this.form).then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.$router.push({name:'GoodsTypeList'})
        }
      );
    }
  }
}

</script>

<style>
.ckeditor{width: 80%; margin: 30px auto 0px; border:1px solid #ddd;}
</style>
