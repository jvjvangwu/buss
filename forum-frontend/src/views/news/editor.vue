<template>
  <div class="news-editor">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? "编辑新闻" : "创建新闻" }}</span>
          <el-button type="primary" @click="handleSubmit"> 保存 </el-button>
        </div>
      </template>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="80px"
        class="mt-4"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入新闻标题"
            maxlength="200"
            show-word-limit
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择分类"
            style="width: 300px"
          >
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.categoryName"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-select
            v-model="form.tagIds"
            multiple
            placeholder="请选择标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in tagList"
              :key="tag.id"
              :label="tag.tagName"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="{
              Authorization: 'Bearer ' + getAccessToken(),
            }"
            :on-success="handleImageUploadSuccess"
            :on-error="handleImageUploadError"
            :show-file-list="false"
            accept="image/*"
          >
            <img
              v-if="form.coverImage"
              :src="form.coverImage"
              class="avatar"
              alt="封面图片"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">点击上传封面图片</div>
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            placeholder="请输入新闻摘要"
            :rows="3"
            maxlength="500"
            show-word-limit
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              style="border-bottom: 1px solid #ccc"
            />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              @onCreated="handleEditorCreated"
              @onChange="handleContentChange"
              style="height: 400px"
            />
          </div>
        </el-form-item>

        <el-form-item label="来源">
          <el-input
            v-model="form.source"
            placeholder="请输入新闻来源"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="来源URL">
          <el-input
            v-model="form.sourceUrl"
            placeholder="请输入来源URL"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="原创">
          <el-switch v-model="form.isOriginal" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { newsApi, categoryApi, tagApi } from "@/api/news";
import type { NewsInfo, NewsParams } from "@/api/news";

// 导入 wangEditor
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css';

// 路由
import { useRoute, useRouter } from "vue-router";

// 路由参数
const route = useRoute();
const router = useRouter();
const newsId = computed(() => route.params.id as string);
const isEdit = computed(() => !!newsId.value);

// 表单
const formRef = ref();
const form = reactive<NewsParams>({
  title: "",
  summary: "",
  content: "",
  coverImage: "",
  categoryId: 0,
  tagIds: [],
  isOriginal: true,
  source: "",
  sourceUrl: "",
});

// 验证规则
const rules = reactive({
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { max: 200, message: "标题长度不能超过200个字符", trigger: "blur" },
  ],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
});

// 加载状态
const loading = ref(false);

// 分类列表
const categoryList = ref<any[]>([]);

// 标签列表
const tagList = ref<any[]>([]);

// 上传配置
const uploadUrl = "http://localhost:8080/api/v1/files/upload";

// 获取访问令牌
const getAccessToken = () => {
  return localStorage.getItem('accessToken') || '';
};

// 编辑器配置
const editorRef = ref<any>(null);

// 工具栏配置
const toolbarConfig = {
  excludeKeys: ['fullScreen', 'code', 'codeBlock']
};

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容',
  MENU_CONF: {
    uploadImage: {
      server: uploadUrl,
      fieldName: 'file',
      headers: {
        Authorization: 'Bearer ' + getAccessToken(),
      },
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxNumberOfFiles: 1,
      onSuccess: (file: any, res: any) => {
        return res.url;
      },
      onError: (file: any, err: any) => {
        ElMessage.error('图片上传失败');
      }
    }
  }
};

// 编辑器创建成功
const handleEditorCreated = (editor: any) => {
  editorRef.value = editor;
};

// 初始化
onMounted(() => {
  fetchCategoryList();
  fetchTagList();
  if (isEdit.value) {
    fetchNewsDetail();
  }
});

// 获取分类列表
const fetchCategoryList = async () => {
  try {
    const categories = await categoryApi.getCategoryTree();
    categoryList.value = categories;
  } catch (error) {
    console.error("获取分类列表失败:", error);
  }
};

// 获取标签列表
const fetchTagList = async () => {
  try {
    const tags = await tagApi.getAllEnabledTags();
    tagList.value = tags;
  } catch (error) {
    console.error("获取标签列表失败:", error);
  }
};

// 获取新闻详情
const fetchNewsDetail = async () => {
  loading.value = true;
  try {
    const news = await newsApi.getNews(Number(newsId.value));
    Object.assign(form, {
      title: news.title,
      summary: news.summary,
      content: news.content,
      coverImage: news.coverImage,
      categoryId: news.categoryId,
      tagIds: news.tags?.map((tag) => tag.id) || [],
      isOriginal: news.isOriginal || true,
      source: news.source,
      sourceUrl: news.sourceUrl,
    });
  } catch (error) {
    ElMessage.error("获取新闻详情失败");
    console.error("获取新闻详情失败:", error);
  } finally {
    loading.value = false;
  }
};

// 图片上传成功
const handleImageUploadSuccess = (response: any) => {
  // 由于响应拦截器的处理，response 直接是 data 部分
  form.coverImage = response.url;
  ElMessage.success("图片上传成功");
};

// 图片上传失败
const handleImageUploadError = () => {
  ElMessage.error("图片上传失败");
};

// 内容变化
const handleContentChange = (editor: any) => {
  form.content = editor.getHtml();
};

// 组件卸载前销毁编辑器
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  loading.value = true;
  try {
    await formRef.value.validate();

    if (isEdit.value) {
      await newsApi.updateNews(Number(newsId.value), form);
      ElMessage.success("编辑成功");
    } else {
      await newsApi.createNews(form);
      ElMessage.success("创建成功");
    }

    router.push("/news/list");
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    loading.value = false;
  }
};

// 路由
import { useRoute, useRouter } from "vue-router";
</script>

<style scoped>
.news-editor {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  width: 200px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.editor-container {
  min-height: 400px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
