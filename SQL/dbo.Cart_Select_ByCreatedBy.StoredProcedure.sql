SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Oscar Romero>
-- Create date: 
-- Description: <A Proc to reads a record from dbo.Cart by user Id. 
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note:
-- =============================================
ALTER proc [dbo].[Cart_Select_ByCreatedBy]
				@CreatedBy int
as
/*  
		Declare @CreatedBy int = 164
		Execute [dbo].[Cart_Select_ByCreatedByV2]
				@CreatedBy
*/
BEGIN
	SELECT 
		 c.[Id] 
		,c.[MenuItemId]
		,c.[Quantity]
		,mi.Name as MenuItemName
		,mi.Description as MenuItemDescription
		,mi.ImageUrl
		,mi.UnitCost
		,mi.OrganizationId
		,o.Name as OrganizationName 
		,l.Id as LocationId
		,l.Zip as LocationZip
		,Ingredients = 
			(
			SELECT           i.Id
					,i.Name
					,i.ImageUrl
					,i.measure 
					,FoodWarningTypes = 
					(
						SELECT	 fwt.Id
								,fwt.name
						FROM dbo.FoodWarningTypes as fwt 
							inner join dbo.IngredientWarnings as iw	on fwt.Id = iw.FoodWarningTypeId 
						WHERE iw.IngredientId = i.Id
						FOR JSON AUTO
					)
					,PurchaseRestrictions = 
						(
						SELECT   pr.Id
								,pr.Name
						FROM dbo.PurchaseRestrictions as pr 
						WHERE pr.Id = i.RestrictionId
						FOR JSON AUTO
						)
			FROM dbo.Ingredients as i 
				inner join dbo.MenuItemIngredients as mii on i.Id = mii.IngredientId
			WHERE mii.MenuItemId=mi.Id 
				--AND i.IsInStock = 1 AND mi.IsDeleted = 0
			FOR JSON AUTO
			)
		,FoodSafeTypes = 
			(
			SELECT
				 fst.Id
				,fst.Name
			FROM dbo.FoodSafeTypes as fst 
				inner join dbo.DietaryRestrictions as dr on dr.FoodSafeTypeId = fst.Id 
			WHERE dr.MenuItemId = mi.Id
			FOR JSON AUTO								
			)
		,c.CustomerNotes
		/*,Modifications = 
			(
			SELECT	         mm.Id
					,mm.Count
					,mm.CostChange
			FROM dbo.MenuModifications as mm
			WHERE mm.EntityId = c.Id
			FOR JSON AUTO
			)*/
			  		  
	FROM [dbo].[Cart] as c 
		inner join dbo.MenuItems as mi on c.MenuItemId = mi.Id
		inner join dbo.Organizations as o on mi.OrganizationId = o.Id
		inner join dbo.Locations as l on o.PrimaryLocationId = l.Id 
	WHERE c.CreatedBy = @CreatedBy

		
END
