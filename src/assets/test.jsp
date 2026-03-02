<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>
<!DOCTYPE html>
<head>
    <title>Document</title>
</head>
<body>
<%
    java.util.Date today = new java.util.Date();
    out.println("오늘 : " + today.toString());
%>
</body>
</html>