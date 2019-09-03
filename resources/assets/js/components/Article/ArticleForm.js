import React, { Component } from 'react';
import { Icon, Form, Input, Button, Upload, message, Modal, Badge, Select } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import styles from "./ArticleForm.css"

class CoverUploader extends React.Component {
  render() {
    const props = {
      action: 'z/upload',
      listType: 'picture',
      defaultFileList: [...this.props.coverList],
      headers:{
        'X-CSRF-TOKEN':document.head.querySelector('meta[name="csrf-token"]').content
      }
    };
    return (
      <div>
        <Upload {...props} onChange={this.props.coverChanged}>
          <Button>
            <Icon type="upload" /> 点此上传
          </Button>
        </Upload>
      </div>
    )
  }
}

export class ArticleForm extends React.Component {
  constructor(props) {
    console.log('3');
    super();
    const aaaa = props.article ? props.article.content : ''
    this.state = {
      //封面文件列表缓存
      coverList:[],
      //表单
      // title: props.article ? props.article.title : '',
      // cover: props.article ? props.article.cover : '',
      // content: BraftEditor.createEditorState(aaaa),
      id: 0,
      title: '',
      tags: [],
      cover: '',
      content: '',
      //分享Modal
      // share_content: props.article ? props.article.content : 'hjkhkjh',
      share_content: '',
      share_type: 'html',
      shareContentModalvisible: false,
      //可选标签
      tags_arr: [],
    };
  }
  componentWillReceiveProps(nextProps) {//新的props是传递给该方法的nextProps参数
    console.log('2');
    if (nextProps.article) {
      console.log(nextProps.article.title);
      this.setState({
        id: nextProps.article.id,
        title: nextProps.article.title,
        tags: nextProps.article.tags,
        cover: nextProps.article.cover,
        content: BraftEditor.createEditorState(nextProps.article.content),
        share_content: nextProps.article.content,
      });
    }
    if (nextProps.tags_arr) {
      this.setState({
        tags_arr: nextProps.tags_arr,
      });
    }
    this.setState({isMarkdown:nextProps.isMarkdown});
  }
  handelTitleChange = (e) => {
    let title = this.refs.title.input.value
    this.setState({title: title})
  }
  handleTagsChange = (value) => {
    this.setState({tags: value})
  }
  handleHTMLChange = (html) => {
    this.setState({
      content: html,
      share_content: html
    })
  }
  //编辑器改变时触发函数
  handleChange = (editorState) => {
    this.setState({
      content: editorState.toHTML()
    })
  }
  uploadFn = (param) => {
    const serverURL = 'z/upload'
    const xhr = new XMLHttpRequest
    const fd = new FormData()
    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
    console.log(param.libraryId)
    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: JSON.parse(xhr.responseText).ObjectURL
      })
    }
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }
    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('X-CSRF-TOKEN', document.head.querySelector('meta[name="csrf-token"]').content);
    xhr.send(fd)
  }

  //显示导出html内容modal
  showShareContentModal = () =>{
    this.setState({
      shareContentModalvisible: true,
    });
  }
  //隐藏html导出modal
  handleShareContentCancel = (e) =>{
    this.setState({shareContentModalvisible: false, });
  }

  shareContent() {
    var that = this;
    if (this.state.share_type == 'markdown') {
      this.setState({
        share_content:this.state.content,
        share_type:'html'
      })
    }else {
      //html 转 markdown
      axios.post('z/articles/markdown', {
        content:this.state.content,
      })
      .then(function (response) {
        console.log(response);
        that.setState({
          share_content: response.data,
          share_type: 'markdown'
        })
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  coverChanged(event) {
    if (event.file.response) {
      this.setState({
        coverList:event.fileList,
        cover:event.file.response.ObjectURL
      })
    }
  }

  render() {
    console.log('1')
    const formItemLayout = {
      wrapperCol: {
        sm:{ span:24 },
        md:{ span:24 },
        lg:{ span:20, offset:2 }
      },
    };
    const editorProps = {
      height: 350,
      contentFormat:'html',
      initialContent: this.state.content,
      contentId: this.state.id,
      onHTMLChange: this.handleHTMLChange,
      placeholder: "输入文章内容",
      media:{
        uploadFn:this.uploadFn
      },
      controls:[
        'undo', 'redo', 'split', 'font-size', 'font-family', 'text-color',
        'bold', 'italic', 'underline', 'strike-through', 'emoji', 'superscript',
        'subscript', 'text-align', 'split', 'headings', 'list_ul', 'list_ol',
        'blockquote', 'code', 'split', 'link', 'split', 'media'
      ],
      extendControls: [
        'separator',
        {
        key: "custom-modal",
        type: 'modal',
        text: '更新封面',
        modal: {
          id: 'cover-modal',
          title: '上传文章封面图片',
          showClose: true,
          showCancel: false,
          showConfirm: false,
          children: (
            <div style={{width: 480, height: 160, padding: 30}}>
              <CoverUploader coverList={this.state.coverList} coverChanged={this.coverChanged.bind(this)}/>
            </div>
          )
        }
      },
      'separator',
      {
        key: 'export-modal',
        type: 'button',
        text: (<Icon type="share-alt" />),
        title:  '导出Html或markdown格式内容',
        onClick: () => {
          this.showShareContentModal()
        }
      }]
    };
    //可选标签
    const children = [];
    var tags_arr = this.state.tags_arr;
    for (var i = 0; i < tags_arr.length; i++) {
      children.push(<Option key={tags_arr[i]}>{tags_arr[i]}</Option>);
    }
    return (
      <Form>
        <FormItem
          {...formItemLayout}>
          <Input
            prefix={<Icon type="info-circle-o" />}
            placeholder="输入文章标题"
            ref="title"
            value={this.state.title}
            onChange={this.handelTitleChange} />
        </FormItem>
        <FormItem
          {...formItemLayout}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="添加标签"
            value={this.state.tags}
            onChange={this.handleTagsChange}
          >
          {children}
          </Select>
        </FormItem>
        <FormItem {...formItemLayout}>
          <div  style={{ borderRadius: 5, boxShadow: 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.1)'}}>
            <BraftEditor
              {...editorProps}
              value={this.state.content}
              onChange={this.handleChange}/>
            <Modal
              title="导出Html或Markdown格式内容"
              visible={this.state.shareContentModalvisible}
              onCancel={this.handleShareContentCancel}
              footer={null}
            >
              <TextArea autosize={{ minRows: 2, maxRows: 6 }} value={this.state.share_content} style={{marginBottom:10}} />
              <div>
                <Badge status="warning" text={this.state.share_type} />
                <Button type="primary" onClick={this.shareContent.bind(this)} icon="swap" style={{float:'right'}}>转换</Button>
              </div>
            </Modal>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} style={{textAlign:'right'}}>
          <Button
            onClick={this.props.handleSubmit.bind(this, {
              title:this.state.title,
              tags:this.state.tags,
              cover:this.state.cover,
              content:this.state.content,
            })}
            type="primary"
            htmlType="submit"
            icon="form"> 保存
          </Button>
        </FormItem>
      </Form>
    )
  }
}
