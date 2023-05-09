/**
 * function to check if the field is editable or not
 * based on the editable and editAccess props
 *  
 * @param {boolean} editable - if the field is editable or not
 * @param {boolean} editAccess - if the user has edit access or not
 * @returns {boolean} - if the field should be editable or not
 */
export function allowEdit(editable: boolean, editAccess: boolean): boolean {
    return editable && editAccess;
}