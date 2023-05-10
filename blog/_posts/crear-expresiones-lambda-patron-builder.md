---
date: 2023-5-10
tags:
  - CSharp
  - PatronDeDiseño
permalink: /blog/:slug
---

# Crear expresiones lambda dinámicamente mediante el patrón Builder

<social-share class="social-share--header" />

Las expresiones lambda son una herramienta poderosa en el mundo de la programación que nos permite escribir funciones anónimas que pueden ser asignadas a una variable o pasadas como argumentos a una función. En .NET, las expresiones lambda se utilizan comúnmente para definir consultas LINQ en tiempo de compilación y para construir árboles de expresiones que se pueden utilizar para generar consultas SQL dinámicamente.

Es el tipo de herramienta perfecta a la hora de construir consultas dinámicamente cuando por ejemplo tenemos un formulario de búsqueda con múltiples campos que opcionalmente pueden o no ser usados para hacer el filtrado de datos. Al combinarlo con el patrón _Builder_ para encapsular la lógica de creación de expresiones lambda junto con la configuración del tipo de comparación, nos permitirá crear expresiones lambda dinámicas muy fácilmente.

## ¿Qué son las expresiones lambda?

Las expresiones lambda son funciones anónimas que se pueden asignar a una variable o pasar como argumento a una función. En C#, las expresiones lambda se escriben utilizando la sintaxis `=>`, como se muestra en el siguiente ejemplo:

``` csharp
int[] numbers = { 1, 2, 3, 4, 5 };
var evenNumbers = numbers.Where(n => n % 2 == 0);
```

En este ejemplo, estamos utilizando una expresión lambda para filtrar los números pares en la matriz _numbers_. La expresión lambda `n => n % 2 == 0` se interpreta como "para cada elemento _n_ en la matriz _numbers_, devuelve _true_ si _n % 2_ es igual a _0_".

Las expresiones lambda son especialmente útiles para definir consultas LINQ en tiempo de compilación. En lugar de construir manualmente una consulta SQL, podemos escribir una expresión lambda que represente la consulta y utilizar LINQ para generar la consulta SQL automáticamente.

## ¿Qué es el patrón Builder?

El patrón _Builder_ es un patrón de diseño creacional que nos permite separar la construcción de un objeto complejo de su representación. En lugar de crear el objeto directamente, utilizamos una clase _Builder_ que encapsula la lógica de construcción del objeto y nos permite configurar sus propiedades de manera flexible.

En el contexto de la creación de expresiones lambda, podemos utilizar el patrón _Builder_ para encapsular la lógica de creación de expresiones lambda combinables y para permitir que los consumidores de la clase configuren el tipo de comparador del dato y el tipo de comparador lógico del conjunto de expresiones.

## Creando una clase Builder para expresiones lambda

Para crear una clase _Builder_ que encapsule la lógica de crear dinámicamente una expresión lambda basada en una lista de filtros parciales, primero debemos definir una interfaz que represente la funcionalidad que queremos permitir que los usuarios utilicen. En este caso, queremos permitir que los usuarios añadan propiedades de filtrado de un objeto y la generación de la expresión lambda con la combinación de todas las propiedades de filtrado. Así sería La interfaz:

``` csharp
public interface IDynamicLambdaBuilder<T>
{
    DynamicLambdaBuilder<T> AddFilter(string propertyName, object value, ComparisonType comparisonType);
    Expression<Func<T, bool>> Build(LogicalOperator logicalOperator)
}
```

La interfaz _IDynamicLambdaBuilder<T>_ utiliza el tipo genérico _T_ para representar el tipo de objeto en el que se está construyendo la expresión lambda. La interfaz define tres métodos:

- _AddFilter()_: Este método permite que los usuarios añadan filtros que se utilizará en la expresión lambda.
- _Build()_: Este método construye la expresión lambda y devuelve un objeto _Expression<Func<T, bool>>_.

Complementaria a dicha interfaz necesitaremos el enumerador que define los tipos de comparadores disponibles para el filtrado de las propiedades:

``` csharp
public enum ComparisonType
{
    Equals,
    NotEquals,
    GreaterThan,
    GreaterThanOrEquals,
    LessThan,
    LessThanOrEquals,
    Contains
}
```

Y el enumerador que define el tipo de operador a usar a la hora de combinar todas las opciones de filtrado:

``` csharp
public enum LogicalOperator
{
    And,
    Or
}
```

Finalmente, la implementación de la interfaz _IDynamicLambdaBuilder_ podría ser la siguiente:

``` csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public class DynamicLambdaBuilder<T>
{
    private readonly ParameterExpression _parameter;
    private readonly List<Expression> _expressions;

    public DynamicLambdaBuilder()
    {
        _parameter = Expression.Parameter(typeof(T), "e");
        _expressions = new List<Expression>();
    }

    public DynamicLambdaBuilder<T> AddFilter(string propertyName, object value, ComparisonType comparisonType = ComparisonType.Equals)
    {
        var property = Expression.Property(_parameter, propertyName);
        var constant = Expression.Constant(value);
        var binary = GetBinaryExpression(property, constant, comparisonType);
        _expressions.Add(binary);
        return this;
    }

    public Expression<Func<T, bool>> Build(LogicalOperator logicalOperator = LogicalOperator.And)
    {
        if (_expressions.Count == 0)
        {
            return e => true;
        }

        var body = _expressions.Aggregate((l, r) => logicalOperator == LogicalOperator.And ? Expression.AndAlso(l, r) : Expression.OrElse(l, r));
        return Expression.Lambda<Func<T, bool>>(body, _parameter);
    }

    private BinaryExpression GetBinaryExpression(MemberExpression property, ConstantExpression constant, ComparisonType comparisonType)
    {
        switch (comparisonType)
        {
            case ComparisonType.Equals:
                return Expression.Equal(property, constant);
            case ComparisonType.NotEquals:
                return Expression.NotEqual(property, constant);
            case ComparisonType.GreaterThan:
                return Expression.GreaterThan(property, constant);
            case ComparisonType.GreaterThanOrEquals:
                return Expression.GreaterThanOrEqual(property, constant);
            case ComparisonType.LessThan:
                return Expression.LessThan(property, constant);
            case ComparisonType.LessThanOrEquals:
                return Expression.LessThanOrEqual(property, constant);
            case ComparisonType.Contains:
                var method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var methodCallExpression = Expression.Call(property, method, constant);
                return Expression.Equal(methodCallExpression, Expression.Constant(true));
            default:
                throw new ArgumentException($"Invalid comparison type: {comparisonType}");
        }
    }
}
```

En este ejemplo, la clase _DynamicLambdaBuilder<T>_ es una clase genérica que toma un parámetro de tipo _T_ que representa el tipo de las entidades de la colección que desea filtrar. La clase tiene un constructor que inicializa una expresión de parámetro para el parámetro lambda y una lista de objetos de expresión para almacenar las expresiones de filtro.

El método _AddFilter_ toma un nombre de propiedad, un valor y un argumento _ComparisonType_ opcional que especifica el tipo de comparación que se usará (el valor predeterminado es _Equals_). El método crea una _MemberExpression_ para la propiedad, una _ConstantExpression_ para el valor y una _BinaryExpression_ para la comparación, según el tipo de comparación.

El método _Build_ toma un argumento _LogicalOperator_ opcional que especifica el operador lógico que se usará al combinar las expresiones de filtro (el valor predeterminado es _And__). El método agrega las expresiones de filtro mediante el operador lógico especificado y crea una expresión lambda que toma un solo parámetro de tipo _T_ y devuelve un bool.

Podemos usar la clase _DynamicLambdaBuilder<T>_ para crear expresiones lambda dinámicas basadas en un número variable de nombres y valores de propiedad como sigue:

``` csharp
var expresionBuilder = new DynamicLambdaBuilder<MyEntity>();

// request is an object that represents a fictitious request
if (request.Property1 != null) {
    expresionBuilder.AddFilter("PropertyName1", request.Property1);
}

if (request.Property2 != null) {
    expresionBuilder.AddFilter("PropertyName2", request.Property2);
}

// _context is a an object that represents my db context
var searchResult = _context.MyEntities
    .Where(expresionBuilder.build())
    .OrderBy(e => e.Id);
```

---
<social-share class="social-share--footer" />
