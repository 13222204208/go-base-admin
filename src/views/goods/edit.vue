<template>
 <div class="app-container">
<el-form ref="form" :model="form" :rules="rules" label-width="80px">

  <el-form-item label="封面" prop="cover">
      <el-upload
        name="upload"
        :action="uploadUrl"
        list-type="picture-card"
        :limit='1'
        :file-list="imgFilesList"
        :on-success="handleUpSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

  </el-form-item>
  <el-form-item label="课程名称" prop="title">
    <el-input v-model="form.title" style="width: 58rem;"></el-input>
  </el-form-item>
    <div class="ckeditor" style="margin-left:10px; width:1000px">
      <!-- 工具栏容器 -->
      <div id="toolbar-container"></div>
      <!-- 编辑器容器 -->
      <div id="editor">

      </div>
    </div>
        <br>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="form.sort" onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )" style="width: 58rem;"></el-input>
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input v-model="form.price" style="width: 58rem;"></el-input>
    </el-form-item>
      <el-form-item label="是否推荐" prop="is_recommend">
        <el-switch v-model="form.is_recommend" :active-value="1" :inactive-value="0"></el-switch>
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
import { editGoods, updateGoods } from '@/api/goods'
export default {
  data() {
    const validateTitle = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入标题'))
      } else {
        callback()
      }
    }

    const validatPrice = (rule, value, callback) => {
        if (rule.required === false && (value === '' || value === null || value === undefined)) {

          callback()

        }
        const isPrice = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/

        if (isPrice.test(value)) {

          callback()

        } else {

          callback(new Error(rule.message || '请输入正确的价格，例：10, 10.00'))

        }
    }
    return {
      editor:null,//编辑器实例
      form:{
        id:'',
        title:'',
        cover:'',
        content:'',
        sort:null,
        price:null,
        is_recommend:null
      },
        rules: {
         title: [
            { required:true,validator: validateTitle, trigger: 'blur' },
            { min: 2, max: 60, message: '长度在 2 到 60个字符', trigger: 'blur' }
          ],
          cover: [
            { required:true,message: '请上传封面图', trigger: 'blur' }
          ],
          content: [
            { required:true,message: '请填写简介', trigger: 'blur' }
          ],
          price: [
            { required:true,message: '请填写课程价格', trigger: 'blur' },
            { min: 0, max: 99999, validator: validatPrice, trigger: 'change' }
          ],
        },
      option:[],
      imgFilesList:[],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl:process.env.VUE_APP_BASE_API+"/upload/img"
    }
  },
  mounted() {
    this.initCKEditor()
  },
  created() {

    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },

  methods: {
    fetchData(id) {
      editGoods(id).then(response => {
        this.editor.setData(response.data.content);
        this.form= response.data;

        var str=process.env.VUE_APP_BASE_API;
         var  leg= str.indexOf('api');
           var url= str.substr(0,leg);

           this.imgFilesList.push({
             "url": url+response.data.cover,
           });
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

    initCKEditor(){
      CKEditor.create(document.querySelector("#editor"),{
        language: 'zh-cn',
        ckfinder:{
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
          uploadUrl:process.env.VUE_APP_BASE_API+"/upload/content/img",
        }
      }).then(editor => {
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
        this.editor = editor;
      }).catch(error => {
        console.log(error)
      });
    },
    /*获取编辑器内容*/
    getHtml(){
      console.log(this.editor.getData());
    },

    onSubmit(){
      this.form.content = this.editor.getData();//富文本内容

      updateGoods(this.form.id,this.form).then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.$router.push({name:'goodsList'})
        }
      );
    }
  }
}

</script>

<style>
.ckeditor{width: 80%; margin: 30px auto 0px; border:1px solid #ddd;}
</style>
