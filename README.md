



# Mybatis  递归实现  
     
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
        
     
