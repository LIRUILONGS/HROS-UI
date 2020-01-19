# vuehr

## Project setup


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

#图标处理:font-awesome
```
import 'font-awesome/css/font-awesome.min.css';
```
#界面UI: ElementUI
```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

```
 #权限管理,
 前端为了用户体验,前后端同时校验.

ssm权限=shiro
springboor+微服务:Spring Security



Notification 通知查询功能:加一个同名添加的查询功能:

背景：从数据库获取时间传到前端进行展示的时候，我们有时候可能无法得到一个满意的时间格式的时间日期，在数据库中显示的是正确的时间格式，获取出来却变成了很丑的时间戳，@JsonFormat注解很好的解决了这个问题，我们通过使用@JsonFormat可以很好的解决：
后台到前台时间格式保持一致的问题，其次，另一个问题是，我们在使用WEB服务的时，可能会需要用到，传入时间给后台，比如注册新用户需要填入出生日期等，这个时候前台传递给后台的时间格式同样是不一致的，而我们的与之对应的便有了另一个注解，
@DataTimeFormat便很好的解决了这个问题，接下来记录一下具体的@JsonFormat与DateTimeFormat的使用过程。

@JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")

   pattern:是你需要转换的时间日期的格式

   timezone：是时间设置为东八区，避免时间在转换中有误差

  提示：@JsonFormat注解可以在属性的上方，同样可以在属性对应的get方法上，两种方式没有区别
  
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  
  在controller层我们使用spring mvc 表单自动封装映射对象时，我们在对应的接收前台数据的对象的属性上加@@DateTimeFormat
  
  
  ##element-ui隐藏滚动条组件scrollbar 的使用
  1 <el-scrollbar></el-scrollbar>
  将会出现滚动的内容放到上述标签内就可以了。 
  这里要简单的设置一下，将标签的height设为100%，查看效果的时候，会出现一个横向的滚动条，如果你不想要横向的滚动条，使用下面css属性设置就可以只显示竖向滚动条。
  .el-scrollbar{height：100%；}
  ps:如果竖向滚动条旁边有1px的竖线，则是因为原始滚动条隐藏的时候，距离不够。只要将margin-right:-15px改成margin-right:-16px即可。
   
  .el-scrollbar__wrap {
     overflow-x: hidden;
     }
  ps: 同时显示横向和竖向滚动条，不能设置overflow:hidden,而是要针对overflow-x: hidden(让浏览器原始滚动条隐藏);设置，否则竖向的滚动条会不随滚轮滚动。
  
 ## Vue ElementUI 如何修改消息提示框样式
    setTimeout(() => {
                        this.$notify.success({
                            title: '系统讯息',
                            message: '角 色 权 限 信 息 加 载 中...',
                            showClose: false,
                            offset: 100,
                            duration: 4000,
                            customClass: 'fontclass'
                        });
                    }, 1100)
                    
                    
                    
 ##element ui dialog custom-class不生效
   
 ```
.el-drawer.drawer {border-radius: 25px;box-shadow: dodgerblue;                                 
  ```    
##Mybatis  递归实现  
     
    <resultMap id="DepartmentWithChildren" type="com.liruilong.hros.model.Department" extends="BaseResultMap">
          <collection property="children" ofType="com.liruilong.hros.model.Department"
                      select="com.liruilong.hros.mapper.DepartmentMapper.getAllDepartmentsByParentId" column="id"/>
    </resultMap>  
    <resultMap id="DepartmentWithChildren" type="com.liruilong.hros.model.Department" extends="BaseResultMap">
        <collection property="children" ofType="com.liruilong.hros.model.Department"
                    select="com.liruilong.hros.mapper.DepartmentMapper.getAllDepartmentsByParentId" column="id" fetchType="lazy"/>
      </resultMap>
      
      <select id="getAllDepartmentsByParentId" resultMap="DepartmentWithChildren">
          select * from department where parentId=#{pid};
        </select>
        
        将父节点传入：
 
 ##加DIV框，加自动滑窗条       
 
 
 ##bug刷新管理员页面会出现横向滚动条
 
 
 
 let 声明的变量只在 let 命令所在的代码块内有效。
 
 const 声明一个只读的常量，一旦声明，常量的值就不能改变。
 
 
 
 ecxl的导入导出，Apache的POI



##局部页面刷新。

 <template>
  <div id="app">
    <router-view v-if="isRouterAlivee" />
  </div>
</template>
<script>
export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    };
  },
  data () {
    return {
      isRouterAlivee: true
    };
  },
  methods: {
    reload () {
      this.isRouterAlivee = false;
      this.$nextTick(function () {
        this.isRouterAlivee = true;
      })
    }
  }
}

</script>
<style >
@import "./common/font/font.css";
</style>


#插入图表无法显示问题：
  <ve-pie :data="item.chartData" ref="chart_tr" :extend="cpuExtend"  height="500px"   :tooltip-visible="false" :judge-width="true"
                  :settings="item.chartSettings" ></ve-pie>

                  <div>
    
      <el-carousel type="card"
                   :interval="4000"
                   height="800px"
                   style="overflow-y: hidden;margin:30px">
        <el-carousel-item v-for="(item,index) in datas"
                          style="border-radius: 15px;border: 1px solid #eaeaea; box-shadow: 0 0 25px #cac6c6;"
                          :key="index">
            <ve-pie :data="item.chartData"
            height="700px"  width="900px"
                  
                    :tooltip-visible="false"
                    :judge-width="true"
                    :settings="item.chartSettings"></ve-pie>
        </el-carousel-item>
      </el-carousel>
   
  </div>



  Date beginContract = employee.getBegincontract();
        Date endContract = employee.getEndcontract();
        double month = (Double.parseDouble(yearFormat.format(endContract)) - Double.parseDouble(yearFormat.format(beginContract))) * 12 + (Double.parseDouble(monthFormat.format(endContract)) - Double.parseDouble(monthFormat.format(beginContract)));
        employee.setContractterm(Double.parseDouble(decimalFormat.format(month / 12)));